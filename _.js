import { users } from "./data";

/* forEach */

const _each = (list, iter) => {
  for (let i = 0; i < list.length; i++) {
    iter(list[i]);
  }
  return list;
};

/* filter */

const _filter = (list, predicate) => {
  const newList = [];

  _each(list, function (val) {
    if (predicate(val)) {
      newList.push(val);
    }
  });

  return newList;
};

const predicate = (user) => {
  return user.age >= 30;
};

/* map */

const over_30 = _filter(users, predicate);

const _map = (list, mapper) => {
  const newList = [];

  _each(list, function (val) {
    newList.push(mapper(val));
  });

  return newList;
};

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
