const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];

// map 구현

const map = (f, iter) => {
  let res = [];

  for (const product of iter) {
    res.push(f(product));
  }
  return res;
};

map((product) => product.name, products);

// filter 구현

const filter = (predi, iter) => {
  let res = [];
  for (const product of iter) {
    if (predi(product)) {
      res.push(product);
    }
  }
  return res;
};

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
