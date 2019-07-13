const get = require("lodash/get");

function defaultIndexer(data, path) {
  if (path) {
    return get(data, path);
  }

  return JSON.stringify(data);
}

function defaultReducer(data) {
  return data;
}

function indexArray(arr = [], { path, indexer, reducer } = {}) {
  if (typeof indexer !== "function") {
    if (typeof path !== "string") {
      console.error(
        new Error("Path must be provided if an indexer is not provided")
      );

      return {};
    }

    indexer = defaultIndexer;
  }

  reducer = reducer || defaultReducer;

  let result = arr.reduce((accumulator, current, index) => {
    accumulator[indexer(current, path, arr, index)] = reducer(
      current,
      arr,
      index
    );

    return accumulator;
  }, {});

  return result;
}

function getIndex(list, item, notFoundError) {
  const itemIndex = list.indexOf(item);

  if (itemIndex === -1) {
    throw notFoundError;
  }

  return itemIndex;
}

function move(
  list,
  item,
  dropPosition,
  notFoundError,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list.splice(itemIndex, 1);
  list.splice(dropPosition, 0, item);
  return list;
}

function update(
  list,
  item,
  updateItem,
  notFoundError,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list[itemIndex] = updateItem;
  return list;
}

function remove(list, item, notFoundError, getItemIndex = getIndex) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list.splice(itemIndex, 1);
  return list;
}

function add(list, item, dropPosition) {
  list = [...list];
  list.splice(dropPosition, 0, item);
  return list;
}

module.exports = {
  indexArray,
  move,
  update,
  remove,
  add
};
