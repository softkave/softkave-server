import { compact, get, isNumber, isString } from 'lodash';
import * as moment from 'moment';
import { AnyObject } from 'mongoose';
import { IResource } from '../models/resource';
import OperationError from './OperationError';
import logger from './logger';
import { AnyFn } from './types';

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
  indexer?: (current: T, path: GetPathType<T> | undefined, arr: T[], index: number) => string;
  reducer?: (current: T, arr: T[], index: number) => R;
  result?: Record<string, R>;
}

export function indexArray<T, R = T>(
  arr: T[] = [],
  opts: IIndexArrayOptions<T, R> = {}
): {[key: string]: R} {
  const indexer = opts.indexer || defaultIndexer;
  const path = opts.path;
  const reducer = opts.reducer || defaultReducer;
  const result = opts.result || {};
  if (typeof indexer !== 'function') {
    if (typeof path !== 'string') {
      logger.info(new Error('Path must be provided if an indexer is not provided'));
      return {};
    }
  }

  arr.reduce((accumulator, current, index) => {
    accumulator[indexer(current, path, arr, index)] = reducer(current, arr, index);
    return accumulator;
  }, result as Record<string, R>);

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

export function getDateStringIfExists(initial?: moment.Moment | Date | string | number) {
  if (initial) {
    const date = moment(initial);
    return date.toISOString();
  }
  return undefined;
}

export function cast<ToType>(resource: any): ToType {
  return resource as unknown as ToType;
}

export function pluralize(str: string, count: number) {
  return count === 1 ? str : `${str}s`;
}

export function methodNotImplemented(): any {
  throw new Error('Method not available');
}

export function makeKey(fields: any[], separator = '-', omitFalsy = true) {
  if (omitFalsy) {
    fields = compact(fields);
  }
  return fields.join(separator);
}

export async function waitOnPromisesAndLogErrors(promises: Promise<any>[]) {
  (await Promise.allSettled(promises)).forEach(
    result => result.status === 'rejected' && logger.error(result.reason)
  );
}

export function checkArgExists<T>(
  d?: T,
  error: Error = new Error('data not provided')
): NonNullable<T> {
  if (!d) {
    throw error;
  }
  return d as NonNullable<T>;
}

export function assertArg(d?: any, error: Error = new Error('data not provided')): asserts d {
  if (!d) {
    throw error;
  }
}

export function appAssert(
  value: any,
  response?: string | Error | AnyFn,
  logMessage?: string
): asserts value {
  if (!value) {
    if (logMessage) {
      logger.error(logMessage);
    }

    if (isString(response)) {
      throw new OperationError(response);
    } else if (response instanceof Error) {
      throw response;
    } else if (response) {
      response();
    } else {
      throw new Error('Assertion failed');
    }
  }
}

export function reverseMap<K extends string, V extends string>(m: Record<K, V>): Record<V, K> {
  const r: Record<V, K> = cast<Record<V, K>>({});
  for (const k in m) {
    r[m[k]] = k;
  }
  return r;
}

export function indexByCustomId(r: IResource) {
  return r.customId;
}

export function extractResourceIdList(resources: Array<IResource>) {
  return resources.map(indexByCustomId);
}

/**
 * Ensure names are unique for resource type.
 */
export function indexByName(r: {name: string}, lowerCase = false) {
  return lowerCase ? r.name.toLowerCase() : r.name;
}

export function isObjectEmpty(d: AnyObject) {
  return Object.keys(d).length > 0;
}

export function extractArg(args: any[], index: number | ((args: any[]) => number)) {
  if (isNumber(index)) {
    return args[index];
  } else {
    return args[index(args)];
  }
}

export interface IMergeDataMeta {
  /**
   * `merge` - Lodash's default, check out Lodash's `mergeWith` for details.
   * `concat` - Joins both arrays, returning a new array.
   * `replace` - Replaces the old array with the new array value.
   * `retain` - Retains the old array value.
   */
  arrayUpdateStrategy: 'merge' | 'concat' | 'replace' | 'retain';
}

export interface IMergeDataMetaExported {
  meta?: IMergeDataMeta;
}

export const mergeData = <T1 = unknown, T2 = unknown>(
  dest: T1,
  source: T2,
  meta: IMergeDataMeta = {arrayUpdateStrategy: 'replace'}
) => {
  const result = mergeWith(dest, source, (objValue, srcValue) => {
    if (Array.isArray(objValue) && srcValue) {
      if (meta.arrayUpdateStrategy === 'concat') {
        return objValue.concat(srcValue);
      } else if (meta.arrayUpdateStrategy === 'replace') {
        return srcValue;
      } else if (meta.arrayUpdateStrategy === 'retain') {
        return objValue;
      }

      // No need to handle the "merge" arrayUpdateStrategy, it happens by
      // default if nothing is returned
    }
  });

  return result as T1 & T2;
};
