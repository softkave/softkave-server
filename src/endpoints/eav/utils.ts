import {NotFoundError} from '../errors';

export function throwEAVNotFoundError() {
  throw new NotFoundError();
}
