import get from "lodash/get";
import logger from "./logger";

function defaultIndexer(data: any, path: any) {
  if (path) {
    return get(data, path);
  }

  return JSON.stringify(data);
}

function defaultReducer(data: any) {
  return data;
}

type GetPathType<T> = T extends object ? keyof T : undefined;

export interface IIndexArrayOptions<T, R> {
  path?: GetPathType<T>;
  indexer?: (
    current: T,
    path: GetPathType<T>,
    arr: T[],
    index: number
  ) => string;
  reducer?: (current: T, arr: T[], index: number) => R;
}

export function indexArray<T, R = T>(
  arr: T[] = [],
  opts: IIndexArrayOptions<T, R> = {}
): { [key: string]: R } {
  const indexer = opts.indexer || defaultIndexer;
  const path = opts.path;
  const reducer = opts.reducer || defaultReducer;

  if (typeof indexer !== "function") {
    if (typeof path !== "string") {
      logger.info(
        new Error("Path must be provided if an indexer is not provided")
      );

      return {};
    }
  }

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

export function getDateString() {
  return new Date().toString();
}
