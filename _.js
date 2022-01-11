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

const mapper = (user) => {
  return user.name;
};

const names = _map(over_30, mapper);
