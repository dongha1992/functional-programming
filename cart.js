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

// 3. 모든 가격

// 4. 선택된 아이템 총 가격
