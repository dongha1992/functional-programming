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

// Odd 함수 구현

function* infinity(i = 0) {
  while (true) {
    yield i++;
  }
}

function* limit(l, iter) {
  for (const a of iter) {
    yield a;
    if (a === l) return;
  }
}

function* odds(l) {
  for (const a of limit(l, infinity(1))) {
    if (a % 2) yield a;
  }
}

for (const a of odds(10)) {
  console.log(a);
}
