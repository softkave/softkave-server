import get from "lodash/get";
import moment from "moment";
import logger from "./logger";

function defaultIndexer(data: any, path: any) {
  if (path) {
    return get(data, path);
  } else if (data && data.toString) {
    return data.toString();
  }

  return String(data);
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

export function getDate(initial?: any) {
  if (initial) {
    const date = new Date(initial);
    return date;
  }

  return new Date();
}

export function getDateString(initial?: any) {
  if (initial) {
    const date = moment(initial);
    return date.toISOString();
  }

  return new Date().toISOString();
}

export function getDateStringIfExists(
  initial?: moment.Moment | Date | string | number
) {
  if (initial) {
    const date = moment(initial);
    return date.toISOString();
  }
}

export function ternaryOp(a: any, b: any, c: any) {
  return a ? b : c;
}

export function cast<ToType>(resource: any): ToType {
  return resource as unknown as ToType;
}

export function same<T>(item: T) {
  return item;
}

export function pluralize(str: string, count: number) {
  return count === 1 ? str : `${str}s`;
}

export function methodNotImplemented(): any {
  throw new Error("Method not available");
}
