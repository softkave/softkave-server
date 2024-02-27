// tslint:disable-next-line: max-classes-per-file
import { isObject } from 'lodash';
import { IPermissionItem } from '../mongo/access-control/permissionItem';
import OperationError, { IOperationErrorParameters } from '../utilities/OperationError';

export class InvalidRequestError extends OperationError {
  name = 'InvalidRequestError';
  message = 'Request is invalid';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

export interface IPermissionDeniedErrorParameters extends IOperationErrorParameters {
  item?: IPermissionItem;
}

export class PermissionDeniedError extends OperationError {
  name = 'PermissionDeniedError';
  message = 'Permission denied';
  item: IPermissionItem | undefined = undefined;
  // TODO: should we add condition?

  constructor(props?: IPermissionDeniedErrorParameters | string) {
    super();
    this.applyProps(props);

    if (isObject(props)) {
      this.item = props.item;
    }
  }
}

export class RateLimitError extends OperationError {
  name = 'RateLimitError';
  message = 'Rate limit in progress, please try again';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

export class MalformedRequestError extends OperationError {
  name = 'MalformedRequestError';
  message = 'Provided input is malformed';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

export class ExpiredError extends OperationError {
  name = 'ExpiredError';
  message = 'Resource has expired';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

export class NotFoundError extends OperationError {
  name = 'NotFoundError';
  message = 'Resource does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

export class ResourceExistsError extends OperationError {
  name = 'ResourceExistsError';
  message = 'Resource exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

/** Wraps children error. For transporting multiple errors you don't want to
 * throw as an array. */
export class WrapperError extends OperationError {
  name = 'WrapperError';
  message = 'Wrapper error. Check cause for errors contained';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

export const endpointErrors = {
  permissionGroupExists(name: string) {
    return new ResourceExistsError(`Permission group with name ${name} exists`);
  },
};
