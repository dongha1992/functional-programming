import { users } from "./data";

const _filter = (list, predicate) => {
  const newList = [];
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      newList.push(list[i]);
    }
  }
  return newList;
};

const predicate = (user) => {
  return user.age >= 30;
};

_filter(users, predicate);
