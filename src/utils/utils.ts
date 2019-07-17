import get from "lodash/get";

// TODO: define types
function defaultIndexer(data: any, path: string) {
  if (path) {
    return get(data, path);
  }

  return JSON.stringify(data);
}

function defaultReducer(data: any) {
  return data;
}

function indexArray(arr: any[] = [], { path, indexer, reducer }: any = {}) {
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

  const result = arr.reduce((accumulator, current, index) => {
    accumulator[indexer(current, path, arr, index)] = reducer(
      current,
      arr,
      index
    );

    return accumulator;
  }, {});

  return result;
}

// update all types to see if they are correct
function getIndex(list: any, item: any, notFoundError?: any) {
  const itemIndex = list.indexOf(item);

  if (itemIndex === -1) {
    throw notFoundError;
  }

  return itemIndex;
}

function move(
  list: any[],
  item: any,
  dropPosition: any,
  notFoundError?: any,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list.splice(itemIndex, 1);
  list.splice(dropPosition, 0, item);
  return list;
}

function update(
  list: any[],
  item: any,
  updateItem: any,
  notFoundError?: any,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list[itemIndex] = updateItem;
  return list;
}

function remove(
  list: any[],
  item: any,
  notFoundError?: any,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list.splice(itemIndex, 1);
  return list;
}

function add(list: any[], item: any, dropPosition: any) {
  list = [...list];
  list.splice(dropPosition, 0, item);
  return list;
}

export { indexArray, move, update, remove, add, getIndex };
