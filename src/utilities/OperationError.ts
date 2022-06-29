import { isObject, isString } from "lodash";

export interface IOperationErrorParameters {
  message?: string;
  field?: string;
  action?: string;
  value?: any;
}

class OperationError extends Error {
  public field?: string;
  public action?: string;
  public value?: string;
  public isPublic = true;

  constructor(props?: IOperationErrorParameters | string) {
    super();
    let message = this.message || "Operation error";
    if (isObject(props)) {
      this.field = props.field;
      this.action = props.action;
      if (props.value) {
        this.value = JSON.stringify(props.value);
      }

      if (props.message) {
        message = props.message;
      }
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

export default OperationError;
