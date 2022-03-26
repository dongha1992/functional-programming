import { products } from "./data";

// 1. 장바구니 담겨있는 모든 수량
_reduce(
  products,
  (tq, product) => {
    return _reduce(
      product.sizes,
      (tq, size) => {
        return tq + size.quantity;
      },
      tq
    );
  },
  0
);

// 2. 선택된 아이템 총 수량

_reduce(
  products,
  (tq, product) => {
    if (product.isSelected) {
      return _reduce(
        product.sizes,
        (tq, size) => {
          return tq + size.quantity;
        },
        tq
      );
    }
    return tq;
  },
  0
);

// 3. 모든 가격

_reduce(
  products,
  (tp, product) => {
    return _reduce(
      product.sizes,
      (tp, size) => {
        return tp + size.quantity * size.price;
      },
      tp
    );
  },
  0
);

// 4. 선택된 아이템 총 가격

_reduce(
  products,
  (tp, product) => {
    return _reduce(
      product.sizes,
      (tp, size) => {
        return tp + size.quantity * size.price;
      },
      tp
    );
  },
  0
);
