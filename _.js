import { users } from "./data";

/* _length */

const _length = _get("length");

/* forEach */

const _each = (list, iter) => {
  const keys = _keys(list);

  for (let i = 0; i < keys.length; i++) {
    iter(list[keys[[i]]]);
  }
  return list;
};

/* _keys */

const _keys = (obj) => {
  const isObject = typeof obj === "object" && !!obj;
  return isObject ? Object.keys(obj) : [];
};

/* curryr */

const _curryr = (fn) => {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(b, a);
        };
  };
};

/* filter */

const _filter = _curryr((list, predicate) => {
  const newList = [];

  _each(list, function (val) {
    if (predicate(val)) {
      newList.push(val);
    }
  });

  return newList;
});

const predicate = (user) => {
  return user.age >= 30;
};

/* map */

const over_30 = _filter(users, predicate);

const _map = _curryr((list, mapper) => {
  const newList = [];

  _each(list, function (val) {
    newList.push(mapper(val));
  });

  return newList;
});

const names = _map(over_30, _get("name"));

/* _curry */

const _curry = (fn) => {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(a, b);
        };
  };
};

const add = _curry((a, b) => {
  return a + b;
});
const add10 = add(10);
console.log(add10(5));

/* _get */

const _get = _curryr((obj, key) => {
  return obj === null ? undefined : obj[key];
});

/* rest */
const _rest = (list, num) => {
  const slice = Array.prototype.slice;
  return slice.call(list, num || 1);
};

/* _reduce */
const _reduce = (...args) => {
  let [list, iter, memo] = args;

  if (args.length === 2) {
    memo = list[0];
    list = _rest(list);
  }

  _each(list, function (val) {
    memo = iter(memo, val);
  });

  return memo;
};

_reduce([1, 2, 3], add);

/* _pipe */

const _pipe = (...args) => {
  const fns = args;
  return function (arg) {
    return _reduce(
      fns,
      function (arg, fn) {
        return fn(arg);
      },
      arg
    );
  };
};

const f1 = _pipe(
  function (a) {
    return a + 1;
  },
  function (a) {
    return a * 2;
  }
);

f1(1);

/* _go */

const _go = (...args) => {
  const fns = _rest(args);

  return _pipe.apply(null, fns)(args[0]);
};

const f2 = _go(
  1,
  function (a) {
    return a + 1;
  },
  function (a) {
    return a * 2;
  },
  function (a) {
    return a * a;
  }
);
/* _go 응용 */

_go(
  users,
  function (users) {
    return _filter(users, function (user) {
      return user.age >= 30;
    });
  },
  function (users) {
    return _map(users, _get("name"));
  }
);

// [ 'ID', 'BJ', 'JM' ]

/* _go + _curryr + arrow function */

_go(
  users,
  _filter((user) => user.age >= 30),
  _map(_get("name"))
);

// [ 'ID', 'BJ', 'JM' ]

/* _forEach 다형성 */

_each(null);
_map(null, (v) => v);

/* _each 외부 다형성 */

_each(
  {
    13: "ID",
    19: "HD",
  },
  (name) => console.log(name)
);

/* 수집하기 - map, values, pluck  */
/* 거르기 - filter, reject, compact, without */
/* 찾아내기 - find, some, every */
/* 접기,축약하기 - reduce, min, max, group_by, count_by */

// 1. 수집하기

/* _values */

const _values = (data) => {
  return _map(data, _identity);
};

const _identity = (val) => {
  return val;
};

/* _pluck */

const _pluck = (data, key) => {
  return _map(data, (obj) => obj[key]);
};

// 2. 거르기

/* _negate */

const _negate = (func) => {
  return function (val) {
    return !func(val);
  };
};

/* _reject */

const _reject = (data, predi) => {
  return _filter(data, _negate(predi));
};

_reject(users, (user) => user.age > 30);

/* _compact */

const _compact = _filter(_identity);

/* _find */

const _find = (list, predi) => {
  const keys = _keys(list);
  for (let i = 0; i < keys.length; i++) {
    const val = list[keys[i]];
    if (predi(val)) {
      return val;
    }
  }
};

/* _findIndex */

const _findIndex = (list, predi) => {
  const keys = _keys(list);
  for (let i = 0; i < keys.length; i++) {
    const val = list[keys[i]];
    if (predi(list[keys[i]])) {
      return i;
    }
  }
  return -1;
};
