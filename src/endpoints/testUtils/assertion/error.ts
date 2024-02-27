import assert = require('assert');
import {isArray, isObject, isString} from 'lodash';
import {indexByName} from '../../../utilities/fns';
import {IStrippedOperationError} from '../../../utilities/OperationError';
import {AnyFn} from '../../../utilities/types';
import {IBaseEndpointResult} from '../../types';
import {containsEveryItemIn} from './list';

export function containsErrorName(errList: IStrippedOperationError[], name: string) {
  containsEveryItemIn(errList, [{name}], indexByName);
}

export function isError(error: any): error is Error {
  return isObject(error) && isString((error as Error).message);
}

export function matchesErrorMessage(error: Error | string, errorMessage: string) {
  const message = isString(error) ? error : error.message;
  return message === errorMessage;
}

export function matchesErrorName(error: Error | string, errorName: string) {
  if (isString(error)) return false;
  return error.name === errorName;
}

export function hasError(
  error01: Array<Error | string>,
  error02: Error | string,
  causeCheckDepth = 3
): boolean {
  return error01.some(error => {
    if (
      isString(error02)
        ? matchesErrorMessage(error, error02)
        : matchesErrorName(error, error02.name) && matchesErrorMessage(error, error02.message)
    ) {
      return true;
    }

    if (isString(error)) return false;
    else if (causeCheckDepth === 0) return false;
    const cause = isArray(error.cause) ? error.cause : [error.cause];
    return hasError(cause, error02, causeCheckDepth - 1);
  });
}

export function expectToMatchError(
  error01: Array<Error>,
  error02: Error | string,
  includeCause = false,
  causeCheckDepth = 3
) {
  const isErrorMatch = hasError(error01, error02, includeCause ? causeCheckDepth : 1);

  // return early is error is match
  if (isErrorMatch) return;

  // match object will diff the objects using jest which we expect to fail,
  // but we're doing it so that jest will show the difference in both
  // objects to let us know how both errors differ
  expect(error01).toMatchObject(error02);
}

export function expectToMatchErrorMessage(error: Error, errorMessage: string) {
  expect(error.message).toBe(errorMessage);
}

export function expectToMatchErrorName(error: Error, errorName: string) {
  expect(error.name).toBe(errorName);
}

export async function expectToThrow(
  fn: AnyFn,
  expectedError?: Error | string,
  includeCause = false,
  causeCheckDepth = 3
) {
  try {
    await fn();
  } catch (error: unknown) {
    if (!expectedError) return;
    if (isError(error)) {
      expectToMatchError([error], expectedError, includeCause, causeCheckDepth);
    } else if (isObject(error)) {
      expect(error).toMatchObject(expectedError);
    } else {
      expect(error).toBe(expectedError);
    }
  }
}

export function expectEndpointResultError(
  result: IBaseEndpointResult | void,
  expectedError?: Error | string
) {
  assert(result);
  assert(result.errors);
  if (!expectedError) return;
  expectToMatchError(result.errors, expectedError);
}
