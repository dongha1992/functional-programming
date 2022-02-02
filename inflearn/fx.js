const products = [
  { name: "반팔티", price: 15000, quantity: 1 },
  { name: "긴팔티", price: 20000, quantity: 2 },
  { name: "핸드폰케이스", price: 15000, quantity: 3 },
  { name: "후드티", price: 30000, quantity: 4 },
  { name: "바지", price: 25000, quantity: 5 },
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

L.map = function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
};

const it = L.map((a) => a + 10, [1, 2, 3]);
it.next(); // 11

// L.filter

L.filter = function* (f, iter) {
  for (const a of iter) {
    if (f(a)) {
      yield f(a);
    }
  }
};

// for of 대체

// let cur
//  while(!(cur = iter.next()).done){
//   const a = cur.value
//   yield f(a)
// }

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

find((u) => u.age < 30, users);
