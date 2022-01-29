// 비동기

const square = (num) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num * num);
    }, 500);
  });
};

const list = [1, 2, 3];

new Promise((resolve) => {
  (function recur(res) {
    if (list.length === res.length) {
      return resolve(res);
    }
    square(list[res.length]).then((val) => {
      res.push(val);
      recur(res);
    });
  })([]);
}).then((res) => {
  console.log(res, "res");
});

// [1, 4, 9]

// 함수형

_go(list, _map(square));
