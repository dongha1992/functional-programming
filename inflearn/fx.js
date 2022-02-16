const products = [
  { name: "반팔티", price: 15000, quantity: 1 },
  { name: "긴팔티", price: 20000, quantity: 2 },
  { name: "핸드폰케이스", price: 15000, quantity: 3 },
  { name: "후드티", price: 30000, quantity: 4 },
  { name: "바지", price: 25000, quantity: 5 },
];

const users = [
  {
    name: "a",
    age: "12",
    family: [
      { name: "a1", age: 53 },
      { name: "a1", age: 53 },
      { name: "a3", age: 53 },
    ],
  },
  {
    name: "b",
    age: "13",
    family: [
      { name: "b1", age: 53 },
      { name: "b1", age: 53 },
      { name: "b3", age: 53 },
    ],
  },
  {
    name: "c",
    age: "14",
    family: [
      { name: "c1", age: 53 },
      { name: "c1", age: 53 },
      { name: "c3", age: 53 },
    ],
  },
  {
    name: "d",
    age: "15",
    family: [
      { name: "d1", age: 53 },
      { name: "d1", age: 53 },
      { name: "d3", age: 53 },
    ],
  },
];

// map 구현

const map = (f, iter) => {
  let res = [];

  for (const product of iter) {
    res.push(f(product));
  }
  return res;
};

const mapC = curry((f, iter) => {
  let res = [];

  for (const product of iter) {
    res.push(f(product));
  }
  return res;
});

map((product) => product.name, products);

// filter
const filter = (predi, iter) => {
  let res = [];
  for (const product of iter) {
    if (predi(product)) {
      res.push(product);
    }
  }
  return res;
};

const filterC = curry((predi, iter) => {
  let res = [];
  for (const product of iter) {
    if (predi(product)) {
      res.push(product);
    }
  }
  return res;
});

// reduce
const reduce = (f, acc, iter) => {
  // 초기값을 iter의 첫 번째 값으로 가져감
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
};

const reduceC = curry((f, acc, iter) => {
  // 초기값을 iter의 첫 번째 값으로 가져감
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});

reduce((a, b) => a + b, [1, 2, 3]);

// map, filter, reduce

const addSum = (a, b) => a + b;

reduce(
  addSum,
  map(
    (p) => p.price,
    filter((p) => p.price < 20000, products)
  )
);

// go, 함수들을 전달해서 즉시 값을 평가함

const go = (...args) => {
  return reduce((acc, fn) => {
    return fn(acc);
  }, args);
};

// pipe, 함수들의 결과를 리턴하는 함수
const pipe =
  (f, ...fns) =>
  (...args) => {
    return go(f(...args), ...fns);
  };

const f = pipe(
  (a, b) => a + b,
  (a) => a + 10,
  (a) => a + 100
);

go(
  products,
  (products) => filter((p) => p.price < 20000, products),
  (products) => map((p) => p.price, products),
  (prices) => reduce(add, prices)
);

// 인자가 원하는 개수만큼 되었을 때 받아둔 함수를 나중에 평가함
// curry

const curry =
  (fn) =>
  (arg, ...args) => {
    return args.length ? fn(arg, ...args) : (...args) => fn(arg, ...args);
  };

// map, filter, reduce에 curry 적용

go(
  products,
  filterC((p) => p.price < 20000),
  mapC((p) => p.price),
  reduceC(add)
);

// sum 함수

const sum = (fn, iter) => {
  return go(iter, mapC(fn), reduceC(add));
};

sum((p) => p.quantity, products);

// range와 느긋한 range

// range

const range = (l) => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};

// L.range

const L = {};

L.range = function* (l) {
  let i = -1;
  while (++i < l) {
    yield i;
  }
};

// L.range 와 range

const test = (name, time, f) => {
  console.time(name);
  while (time--) {
    f();
  }
  console.timeEnd(name);
};

test("range", 10, () => reduce(add, range(1000000)));
test("L.range", 10, () => reduce(add, L.range(1000000)));

// take
const take = (l, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length === l) {
      return res;
    }
  }
  return res;
};

// L.map

L.map = curry(function* (f, iter) {
  for (const a of iter) {
    // yield f(a)
    yield goAsnc(a, f);
  }
});

const it = L.map((a) => a + 10, [1, 2, 3]);
it.next(); // 11

// L.filter

L.filter = function* (f, iter) {
  for (const a of iter) {
    if (f(a)) {
      yield a;
    }
  }
};

// for of 대체

//  L.filter = function* (f, iter) {
//    iter = iter[Symbol.iterator]();
//    let cur;
//    while (!(cur = iter.next()).done) {
//      const a = cur.value;
//      if (f(a)) {
//        yield a;
//      }
//    }
//  }

// queryStr

const queryStr = (obj) => {
  return go(
    obj,
    Object.entries,
    map(([k, v]) => `${k}=${v}`),
    reduce((a, b) => `${a}&${b}`)
  );
};

// find

const find = (f, iter) => {
  return go(iter, filter(f), take(1), ([a]) => a);
};

// L.map으로 map 만들기
// L.map curry로 만듦

// 1) go로

// const mapL = curry((f, iter) => {
//   return go(iter, L.map(f), take(Infinity));
// });

// 2) pipe로

const mapL = curry(pipe(L.map, take(Infinity)));

mapL((a) => a + 10, L.range(4));

// L.flatten

const isIterable = (a) => {
  return a && a[Symbol.iterator];
};

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) {
      for (const b of a) {
        yield b;
      }
    } else {
      yield a;
    }
  }
};

const flatten = pipe(L.flatten, take(Infinity));

// L.deepFlat

L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) {
      yield* f(a);
    } else {
      yield a;
    }
  }
};

// L.faltMap

L.flatMap = curry(pipe(L.map, L.flatten));

// 2차원 배열 다루기

go(
  users2,
  L.map((u) => u.family),
  L.flatten,
  L.filter((u) => u.age < 20),
  L.map((u) => u.name),
  take(4)
);

// 비동기
// promise의 가장 큰 특징은 비동기 값을 일급으로 다룬다는 것 = promise 객체를 리턴해서 값으로 다룸

/* 일급 활용 */

// 아래의 경우는 a, f 두 인자 모두 동기적으로 작동해야 함

const go1 = (a, f) => f(a);
const add5 = (a) => a + 5;

// 비동기로 함수값을 넘김

const delay100 = (a) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(a);
    }, 100)
  );

// Promise 인지 검사를 하고

const goAsnc = (a, f) => {
  return a instanceof Promise ? a.then(f) : f(a);
};

go2(delay100(10), add5);

// Promise는 값으로 다뤄질 수 있으니 값을 만들어서 then처리

const r2 = go2(delay100(10), add5);
r2.then();

// Composition --> 안전하게 합성하기 위해 모나드 등장

const g = (a) => a + 1;
const f = (a) => a * a;

// f(g()) -> 빈값 들어올 수도 있음
// []라는 박스를 만들고 거기 안에 있는 값을 다룸.

[1]
  .map(g)
  .map(f)
  .forEach((r) => console.log(r)); // 4

// 값이 없는 경우, 마지막 forEach가 실행되지 않음.

[]
  .map(g)
  .map(f)
  .forEach((r) => console.log(r));

// promise인 경우, 비동기 값을 안전하게 합성한다.
// 하지만 Promise경우도 resolve에 값이 없으면 NaN을 뱉는다.
// 즉, promise도 값이 있고 없고의 관점이 아니라, 동기냐 비동기에 초점을 맞추기 때문

Promise.resolve(1)
  .then(g)
  .then(f)
  .then((r) => console.log(r)); // 4

// Kleisli Composition
// 오류가 있을 수 있는 상황에서 안전하게 합성하게 할 수 있는 규칙

// f(g(x)) = f(g(x))의 경우 오른쪽 x가 함수 g에 의해 평가될 때 왼쪽 x와 값이 달라질 수 있음
// f(g(x)) = g(x)가 같게 하는 것이 Kleisli Composition

const store = [
  { id: 1, name: "aa" },
  { id: 2, name: "bb" },
  { id: 3, name: "cc" },
];

// const getUserById = (id) => {
//   return find((u) => u.id === id, store);
// };

const getUserById = (id) => {
  return find((u) => u.id === id, store) || Promise.reject("못찾음");
};

const fName = ({ name }) => name;
const g2 = getUserById;

const fg = (id) => fName(g2(id)); // "bb"

console.log(fg(2) === fg(2)); // true

// 하지만 실무에선 이런 일이 벌어질 수도 있다.

const res1 = fg(2);

store.pop();
store.pop();

const res2 = fg(2);

console.log(fg(2) === fg(2)); // false

// promise 경우

const fg2 = (id) => Promise.resolve(id).then(g2).then(fName);

/* go, pipe, reduce로 비동기 제어 */

// go, pipe를 제어하는 reduce를 수정한다.

const reduceAsnc1 = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = acc[Symbol.iterator]();
  }

  let cur;

  while (!(cur = iter.next()).done) {
    const val = cur.value;
    // promise를 만나면 then으로 promise 처리
    // 하지만 좋은 코드는 아님

    /*
      goAsnc(1, 
        a => a + 10,
        a => Promise.resolve(a - 9),
        a => a + 10,
        )
    */
    // 위의 상황에서 promise 아래 코드들은 promise 체인에 물리기 때문에.
    acc = acc instanceof Promise ? acc.then((acc) => f(acc, val)) : f(acc, val);
  }
  return acc;
});

const reduceAsnc2 = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = acc[Symbol.iterator]();
  }

  // 유명함수를 만들어서 재귀로 return

  // return (function recur(acc) {
  //   let cur;
  //   while (!(cur = iter.next()).done) {
  //     const val = cur.value;
  //     acc = f(acc, val);
  //     // acc가 promise면 recur 실행
  //     // 하지만 여전히 첫 번째 인자가 promise면 에러 발생
  //     if (acc instanceof Promise) {
  //       return acc.then(recur);
  //     }
  //   }
  //   return acc;
  // })(acc);

  // 아래처럼 goAsnc를 만들어서 실행하면 됨

  return goAsnc(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      const val = cur.value;
      acc = f(acc, val);
      if (acc instanceof Promise) {
        return acc.then(recur);
      }
    }
    return acc;
  });
});

// const goAsnc = (a, f) => {
//   return a instanceof Promise ? a.then(f) : f(a);
// };

/* 지연 평가 + Promise --> L.map, map, take*/

// 1. L.map에 goAsnc 추가
// 2. take에서 promise 인지 판단 후 재귀함수

/* promise 제어 take 함수 */

// const take = curry((l, iter) => {
//   let res = [];
//   return (function recur() {
//     for (const a of iter) {
//       if (a instanceof Promise) {
//         return a.then((result) => {
//           res.push(result);
//           console.log(res, "S", res.length === l);
//           if (res.length === l) {
//             return res;
//           } else {
//             return recur();
//           }
//         });
//       }
//       res.push(a);
//       if (res.length === l) {
//         return res;
//       }
//     }
//     return res;
//   })();
// });

/* async, await */
