const F = require("fxjs/Strict");

const server = () =>
  Promise.resolve([
    {
      isSelected: true,
      id: 1,
      name: "반팔티",
      price: 10000,
      sizes: [
        { name: "L", quantity: 1, price: 10000 },
        { name: "XL", quantity: 1, price: 10000 },
        { name: "XXL", quantity: 1, price: 10000 },
      ],
    },
    {
      isSelected: true,
      id: 2,
      name: "후드티",
      price: 20000,
      sizes: [
        { name: "L", quantity: 3, price: 20000 },
        { name: "XL", quantity: 1, price: 20000 },
      ],
    },
    {
      isSelected: false,
      id: 3,
      name: "맨투맨",
      price: 16000,
      sizes: [{ name: "L", quantity: 2, price: 12000 }],
    },
  ]);

const local = [
  {
    isSelected: true,
    id: 1,
    name: "반팔티",
    price: 10000,
    sizes: [
      { name: "L", quantity: 1, price: 10000 },
      { name: "XL", quantity: 1, price: 10000 },
      { name: "XXL", quantity: 1, price: 10000 },
    ],
  },
  {
    isSelected: true,
    id: 2,
    name: "후드티",
    price: 20000,
    sizes: [
      { name: "L", quantity: 3, price: 20000 },
      { name: "XL", quantity: 1, price: 20000 },
    ],
  },
  {
    isSelected: true,
    id: 3,
    name: "맨투맨",
    price: 16000,
    sizes: [{ name: "L", quantity: 4, price: 12000 }],
  },
];

const sumOfObjectProperties = F.reduce(
  (acc, obj) => (
    F.go(
      obj,
      F.entries,
      F.each(([k, v]) => (acc[k] = typeof v === "number" ? acc[k] + v : acc[k]))
    ),
    acc
  )
);

const filterByColumn = F.curry2((a, column, b) => {
  const aValues = F.go(
    a,
    F.map((a) => a[column])
  );

  return F.go(
    b,
    F.filter((b) => F.includes(b[column], aValues))
  );
});

const getTupleByColumn = F.curry2((a, column, b) => {
  const aObj = F.go(
    a,
    F.indexBy((a) => a[column])
  );

  return F.go(
    b,
    F.map((b) => [aObj[b[column]], b])
  );
});

const addSizesQuantity = ([server, local]) => {
  return F.go(
    local.sizes,
    filterByColumn(server.sizes, "name"),
    getTupleByColumn(server.sizes, "name"),
    F.map(sumOfObjectProperties)
  );
};

const mergeSizes = F.curry((server, sizes) =>
  F.go(
    server,
    F.zip(sizes),
    F.map(([sizes, server]) => ({ ...server, sizes }))
  )
);

const main = async () => {
  const serverData = await server();

  return F.go(
    local,
    filterByColumn(serverData, "id"),
    getTupleByColumn(serverData, "id"),
    (tuple) =>
      F.go(
        tuple,
        F.map(addSizesQuantity),
        mergeSizes(F.map(([server]) => server, tuple))
      ),
    F.each(F.log)
  );
};

main();
