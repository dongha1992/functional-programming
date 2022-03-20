const curryFn =
  (fn) =>
  (arg, ...args) => {
    return args.length ? fn(arg, ...args) : (...args) => fn(arg, ...args);
  };

const F = {
  map: curryFn((fn, iter) => {
    let res = [];

    // 위 코드 명령형으로 작성

    iter = iter[Symbol.iterator]();
    let cur;

    while (!(cur = iter.next()).done) {
      const a = cur.value;
      res.push(fn(a));
    }
    return res;
  }),

  filter: curryFn((predi, iter) => {
    let res = [];

    iter = iter[Symbol.iterator]();
    let cur;

    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (predi(a)) {
        res.push(a);
      }
    }
    return res;
  }),

  reduce: curryFn((fn, acc, iter) => {
    // 초기값을 iter의 첫 번째 값으로 가짐
    if (!iter) {
      iter = acc[Symbol.iterator]();
      acc = iter.next().value;
    } else {
      iter = iter[Symbol.iterator]();
    }

    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      acc = fn(acc, a);
    }
    return acc;
  }),

  go: (...args) => {
    return F.reduce((a, fn) => {
      return fn(a);
    }, args);
  },

  // pipe, 합성 함수를 리턴하는 함수
  // 첫 번째 함수 인자가 두 개 올 수 있도록 해야함

  pipe:
    (fn, ...fns) =>
    (...args) => {
      return F.go(fn(...args), ...fns);
    },

  range: (l) => {
    let i = -1;
    let res = [];
    while (++i < l) {
      res.push(i);
    }
    return res;
  },

  take: curryFn((l, iter) => {
    let res = [];

    iter = iter[Symbol.iterator]();
    let cur;

    while (!(cur = iter.next()).done) {
      const a = cur.value;
      res.push(a);
      if (res.length === l) {
        return res;
      }
    }
    return res;
  }),

  join: curryFn((sep = ",", iter) => {
    return F.reduce((a, b) => {
      return `${a}${sep}${b}`;
    }, iter);
  }),
};

const L = {
  range: function* (l) {
    let i = -1;
    while (++i < l) {
      yield i;
    }
  },

  map: curryFn(function* (fn, iter) {
    iter = iter[Symbol.iterator]();
    let cur;

    while (!(cur = iter.next()).done) {
      const a = cur.value;
      yield fn(a);
    }
  }),

  filter: curryFn(function* (fn, iter) {
    iter = iter[Symbol.iterator]();
    let cur;

    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (fn(a)) {
        yield a;
      }
    }
  }),

  entries: function* (obj) {
    for (const k in obj) {
      yield [k, obj[k]];
    }
  },
};
