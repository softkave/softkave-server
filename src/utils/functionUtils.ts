import get from "lodash/get";
import logger from "./logger";

function defaultIndexer(data: object | any[], path: string) {
  if (path) {
    return get(data, path);
  }

  return JSON.stringify(data);
}

function defaultReducer(data: any) {
  return data;
}

export function indexArray(
  arr: any[] = [],
  { path, indexer, reducer }: any = {}
) {
  if (typeof indexer !== "function") {
    if (typeof path !== "string") {
      logger.info(
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

export function getIndex(
  list: any[],
  item: any,
  notFoundError?: string | Error
) {
  const itemIndex = list.indexOf(item);

  if (itemIndex === -1) {
    throw notFoundError;
  }

  return itemIndex;
}

export function immutableMove(
  list: any[],
  item: any,
  dropPosition: number,
  notFoundError?: string | Error,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list.splice(itemIndex, 1);
  list.splice(dropPosition, 0, item);
  return list;
}

export function immutableUpdate(
  list: any[],
  item: any,
  data: any,
  notFoundError?: string | Error,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list[itemIndex] = data;
  return list;
}

export function immutableRemove(
  list: any[],
  item: any,
  notFoundError?: string | Error,
  getItemIndex = getIndex
) {
  const itemIndex = getItemIndex(list, item, notFoundError);
  list = [...list];
  list.splice(itemIndex, 1);
  return list;
}

export function immutableAdd(list: any[], item: any, dropPosition?: number) {
  list = Array.isArray(list) ? [...list] : [];

  if (dropPosition) {
    list.splice(dropPosition, 0, item);
  } else {
    list.push(item);
  }

  return list;
}
