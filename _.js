import { users } from "./data";

/* forEach */

const _each = (list, iter) => {
  for (let i = 0; i < list.length; i++) {
    iter[list[i]];
  }
  return list;
};

/* filter */

const _filter = (list, predicate) => {
  const newList = [];

  _each(list, function (val) {
    if (predicate(val)) {
      newList.push(val);
    }
  });

  return newList;
};

const predicate = (user) => {
  return user.age >= 30;
};

/* map */

const over_30 = _filter(users, predicate);

const _map = (list, mapper) => {
  const newList = [];

  _each(list, function (val) {
    newList.push(mapper(val));
  });

  return newList;
};

const names = _map(over_30, _get("name"));

/* _curry */

const _curry = (fn) => {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(a, b);
        };
  };
};

const add = _curry((a, b) => {
  return a + b;
});
const add10 = add(10);
console.log(add10(5));

/* curryr */

const _curryr = (fn) => {
  return function (a, b) {
    return arguments.length === 2
      ? fn(a, b)
      : function (b) {
          return fn(b, a);
        };
  };
};

/* _get */

const _get = _curryr((obj, key) => {
  return obj === null ? undefined : obj[key];
});
