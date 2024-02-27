import {isObject, isString} from 'lodash';

export interface IOperationErrorParameters {
  /** Error message */
  message?: string;

  /** Offending field if error is a validation-related error. */
  field?: string;

  /** Action the client should take. */
  action?: string;

  /** Offending value if error is a validation-related error. */
  value?: any;

  /** Can be returned from an endpoint if `true`. */
  isPublic?: boolean;

  /** Error(s) contained in or causing this error. */
  cause?: Error | Error[];
}

class OperationError extends Error {
  /** Offending field if error is a validation-related error. */
  field?: string;

  /** Action the client should take. */
  action?: string;

  /** Offending value if error is a validation-related error. */
  value?: string;

  /** Can be returned from an endpoint if `true` */
  isPublic = true;

  /** Error(s) contained in or causing this error. */
  cause?: Error | Error[];

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }

  applyProps(props?: IOperationErrorParameters | string) {
    let message = this.message ?? 'Operation error';
    if (isObject(props)) {
      this.field = props.field;
      this.action = props.action;
      this.isPublic = props.isPublic ?? true;
      this.cause = props.cause;
      if (props.value) this.value = JSON.stringify(props.value);
      if (props.message) message = props.message;
    } else if (isString(props)) {
      message = props;
    }
    this.message = message;
  }
}

export interface IStrippedOperationError {
  name: string;
  message: string;
  field?: string;
  action?: string;
  value?: string;
}

export function isOperationError(e: any) {
  return e && (e as Error).message;
}

export function isPublicError(error: any) {
  return (error as OperationError)?.isPublic;
}

export default OperationError;
