import {WrapperError} from '../endpoints/errors';
import OperationError, {IOperationErrorParameters, isPublicError} from './OperationError';

export class ServerError extends OperationError {
  name = 'ServerError';
  message = 'Server error';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidInputError extends OperationError {
  name = 'InvalidInputError';
  message = 'Input is invalid';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class IdExistsError extends OperationError {
  name = 'IdExistsError';
  message = 'Resource ID exists';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

export function wrappedOrServerError(error: any) {
  if (error instanceof WrapperError) {
    return error;
  }

  return new ServerError({
    cause: error,
    message: isPublicError(error) ? error.message : 'Error adding permissions groups',
  });
}
