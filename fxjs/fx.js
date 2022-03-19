const F = {
  map: (fn, iter) => {
    const res = [];
    for (const a of iter) {
      res.push(fn(a));
    }
    return res;
  },

  filter: (predi, iter) => {
    const res = [];
    for (const a of iter) {
      if (predi(a)) {
        res.push(a);
      }
    }
    return res;
  },

  reduce: (fn, acc, iter) => {
    // 초기값을 iter의 첫 번째 값으로 가짐
    if (!iter) {
      iter = acc[Symbol.iterator]();
      acc = iter.next().value;
    }

    for (const a of iter) {
      acc = fn(acc, a);
    }
    return acc;
  },

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
};
