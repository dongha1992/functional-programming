// 이터러블

const iterable = {
  [Symbol.iterator]() {
    let i = 3;
    return {
      next() {
        return i === 0
          ? { done: true }
          : {
              value: i--,
              done: false,
            };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  },
};

let iterator = iterable[Symbol.iterator]();

iterator.next();
iterator.next();
iterator.next();
iterator.next();

// 제너레이터

function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

let iter = gen();
iter.next();
iter.next();
iter.next();
iter.next();
