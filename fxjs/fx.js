const curryFn =
  (fn) =>
  (arg, ...args) => {
    return args.length ? fn(arg, ...args) : (...args) => fn(arg, ...args);
  };

const F = {
  map: curryFn((fn, iter) => {
    let res = [];

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

  go1: (a, fn) => {
    return a instanceof Promise ? a.then(fn) : fn(a);
  },

  reduce: curryFn((fn, acc, iter) => {
    // 초기값을 iter의 첫 번째 값으로 가짐
    if (!iter) return F.reduce(fn, head((iter = acc[Symbol.iterator]())), iter);

    iter = iter[Symbol.iterator]();

    // Promise 경우, 재귀를 이용해야함 안 그러면 Promise 체인에 물려서
    // 다음 값은 동기적 처리해야 하는데 Promise로 하게 되면 성능 저하

    // while (!(cur = iter.next()).done) {
    //   const a = cur.value;
    //   // acc = fn(acc, a);
    //   acc = acc instanceof Promise ? acc.then((acc) => fn(acc, a)) : fn(acc, a);
    // }
    // return acc;

    // Promise 방어 재귀로 수정
    // go1으로 묶는 이유는 첫 번째가 인자가 promise인 경우 때문에

    return F.go1(acc, function recur(acc) {
      let cur;
      while (!(cur = iter.next()).done) {
        acc = reduceHelper(acc, cur.value, fn);
        if (acc instanceof Promise) {
          return acc.then(recur);
        }
      }

      return acc;
    });
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

    /* 재귀를 통해 Promise 검사 */

    // return (function recur() {
    //   let cur;
    //   while (!(cur = iter.next()).done) {
    //     const a = cur.value;

    //     if (a instanceof Promise) {
    //       return a.then((a) => {
    //         res.push(a);
    //         if (res.length === l) {
    //           return res;
    //         } else {
    //           return recur();
    //         }
    //       });
    //     }
    //     res.push(a);
    //     if (res.length === l) {
    //       return res;
    //     }
    //   }
    //   return res;
    // })();

    /* 아래는 리팩토링 */

    return (function recur() {
      let cur;
      while (!(cur = iter.next()).done) {
        const a = cur.value;

        if (a instanceof Promise) {
          return a
            .then((a) => {
              return (res.push(a), res).length === l ? res : recur();
            })
            .catch((e) => (e === nop ? recur() : Promise.reject("error")));
        }
        res.push(a);
        if (res.length === l) {
          return res;
        }
      }
      return res;
    })();
  }),

  join: curryFn((sep = ",", iter) => {
    return F.reduce((a, b) => {
      return `${a}${sep}${b}`;
    }, iter);
  }),

  isIterable: (a) => {
    return a && a[Symbol.iterator];
  },

  find: curryFn((predi, iter) => {
    for (const a of iter) {
      if (predi(a)) {
        return a;
      }
    }
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
    // 1.

    // iter = iter[Symbol.iterator]();
    // let cur;

    // while (!(cur = iter.next()).done) {
    //   const a = cur.value;
    //   yield fn(a);
    // }

    // 2.

    for (const a of iter) {
      yield F.go1(a, fn);
    }
  }),

  filter: curryFn(function* (predi, iter) {
    // 1.
    // iter = iter[Symbol.iterator]();
    // let cur;
    // while (!(cur = iter.next()).done) {
    //   const a = cur.value;
    //   if (predi(a)) {
    //     yield a;
    //   }
    // }

    // 2.

    for (const a of iter) {
      const b = F.go1(a, predi);
      if (b instanceof Promise) {
        yield b.then((b) => (b ? a : Promise.reject(nop)));
      } else if (b) {
        yield a;
      }
    }
  }),

  entries: function* (obj) {
    for (const k in obj) {
      yield [k, obj[k]];
    }
  },

  flatten: function* (iter) {
    for (const a of iter) {
      if (F.isIterable(a)) {
        // for (const b of a) yield b;
        yield* a;
      } else {
        yield a;
      }
    }
  },
  deepFlat: function* f(iter) {
    for (const a of iter) {
      if (F.isIterable(a)) {
        yield* f(a);
      } else {
        yield a;
      }
    }
  },
  flatMap: function* (iter) {},
};

const C = {
  reduce: () => {},
};

const mapByLazy = curryFn(F.pipe(L.map, F.take(Infinity)));

const filterByLazy = curryFn(F.pipe(L.filter, F.take(Infinity)));

// flatMap은 함수의 조합으로 구현 가능

const flatMapByPipe = curryFn(F.pipe(L.map, L.flatten));

const nop = Symbol("nop");

const reduceHelper = (acc, a, fn) => {
  return a instanceof Promise
    ? a.then(
        (a) => fn(acc, a),
        (e) => (e == nop ? acc : Promise.reject("error"))
      )
    : fn(acc, a);
};

const head = (iter) => F.go1(F.take(1, iter), ([h]) => h);
