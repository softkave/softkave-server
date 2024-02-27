import {IBaseEndpointResult} from '../types';

export const notImplementFn = (() => {
  throw new Error('Not implemented');
}) as any;

export const testNoop = (() => {}) as any;

export function assertResultOk(result?: IBaseEndpointResult | void) {
  if (result?.errors) {
    throw result.errors;
  }
}
