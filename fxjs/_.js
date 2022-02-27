/* curry가 적용된 add()를 실행하기 위해서는 add(1)(2)
 *  만약, add(1, 2) 이렇게 인자가 두 개 들어왔을 경우 즉시 실행되게 해줘야 함
 */

function _curry(fn) {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(a, b);
        };
  };
}

const _curryr =
  (fn) =>
  (arg, ...args) => {
    return args.length ? fn(arg, ...args) : (...args) => fn(...args, arg);
  };

const _get = _curryr((obj, key) => {
  return obj === null ? undefined : obj[key];
});

/* _get은 curry 적용해서 _get("name")(users2[0]) 이렇게 표현 가능
 * 결국 const getName = _get("name"),
 *     getName(users2[0]) 이렇게 함수로 만들 수 있음.
 */

const _isObject = (obj) => {
  return typeof obj === "object" && !!obj;
};

const _keys = (obj) => {
  return _isObject(obj) ? Object.keys(obj) : [];
};

const _length = _get("length");

const _each = (list, iter) => {
  /* _each 내부 다형성 확장 */
  const keys = _keys(list);

  for (let i = 0; i < keys.length; i++) {
    iter(list[keys[i]], keys[i]);
  }
  return list;
};

const _filter = _curryr((list, predi) => {
  const newList = [];
  _each(list, (val) => {
    if (predi(val)) {
      newList.push(val);
    }
  });
  return newList;
});

const _map = _curryr((list, mapper) => {
  const newList = [];
  _each(list, (val) => {
    newList.push(mapper(val));
  });

  return newList;
});

const _rest = (list, number) => {
  const slice = Array.prototype.slice;
  return slice.call(list, number || 1);
};

const _reduce = (...args) => {
  let [list, iter, memo] = args;
  // 초기값 없는 경우
  if (args.length === 2) {
    memo = list[0];
    list = _rest(list);
  }
  _each(list, (val) => {
    memo = iter(memo, val);
  });
  return memo;
};

/* pipe는 함수를 인자로 받아서 함수를 연속적으로 사용
 *  함수를 리턴하는 함수가 pipe임 즉, pipe의 추상화 버전이 reduce
 */

/* 함수 선언식 pipe */

function _pipe(...args) {
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
}

/* 화살표 pipe */

/* go는 즉시 실행되는 파이프 함수 */

const _go = (...args) => {
  // 아래는 _reduce와 동작 동일
  const fns = _rest(args);
  return _pipe.apply(null, fns)(args[0]);
};

/* 1-1 identity */

const _identity = (val) => {
  return val;
};

/* 1-2 values */

const _values = (data) => {
  return _map(data, _identity);
};

/* 1-3 pluck */

const _pluck = (data, key) => {
  return _map(data, (obj) => obj[key]);
};

/* 2-1 negate */

const _negate = (func) => (val) => {
  return !func(val);
};

/* 2-2 reject */

const _reject = (data, predi) => {
  return _filter(data, _negate(predi));
};

/* 2-3 compact */

const _compact = _filter(_identity);

/* 3-1 find */

const _find = _curryr((list, predi) => {
  const keys = _keys(list);
  for (let i = 0; i < keys.length; i++) {
    const val = list[keys[i]];
    if (predi(val)) {
      return val;
    }
  }
});

/* 3-2 findIndex */

const _findIndex = _curryr((list, predi) => {
  const keys = _keys(list);
  for (let i = 0; i < keys.length; i++) {
    if (predi(list[keys[i]])) {
      return i;
    }
  }
  return -1;
});

/* 3-3 some */

const _some = _curryr((data, predi) => {
  return _findIndex(data, predi) !== -1;
});

/* 3-4 every */
const _every = _curryr((data, predi) => {
  return _findIndex(data, _negate(predi)) === -1;
});
