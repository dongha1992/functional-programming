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
      price: 10000,
      sizes: [
        { name: "L", quantity: 1, price: 10000 },
        { name: "XL", quantity: 1, price: 10000 },
      ],
    },
    {
      isSelected: false,
      id: 3,
      name: "맨투맨",
      price: 10000,
      sizes: [{ name: "L", quantity: 1, price: 10000 }],
    },
    {
      isSelected: false,
      id: 4,
      name: "반팔티2",
      price: 10000,
      sizes: [
        { name: "L", quantity: 1, price: 10000 },
        { name: "XL", quantity: 1, price: 10000 },
      ],
    },
  ]);

const local = [
  {
    isSelected: true,
    id: 1,
    name: "반팔티",
    price: 20000,
    sizes: [
      { name: "L", quantity: 2, price: 20000 },
      { name: "XL", quantity: 3, price: 20000 },
      { name: "XXL", quantity: 3, price: 20000 },
    ],
  },
  {
    isSelected: true,
    id: 2,
    name: "후드티",
    price: 20000,
    sizes: [
      { name: "L", quantity: 3, price: 20000 },
      { name: "XL", quantity: 3, price: 20000 },
    ],
  },
  {
    isSelected: true,
    id: 3,
    name: "맨투맨",
    price: 20000,
    sizes: [{ name: "L", quantity: 4, price: 20000 }],
  },
];
