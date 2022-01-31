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
