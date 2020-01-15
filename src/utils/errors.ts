import OperationError, { IOperationErrorParameters } from "./OperationError";
import { DataType } from "./types";

export class ServerError extends OperationError {
  public name = "ServerError";
  public message = "Server error";
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidValueError extends OperationError {
  public name = "InvalidValueError";
  public message = "Value is invalid";
}

export interface IValueTooSmallErrorParameters
  extends IOperationErrorParameters {
  min?: number;
  type?: DataType;
}

// tslint:disable-next-line: max-classes-per-file
export class ValueTooSmallError extends OperationError {
  public name = "ValueTooSmallError";

  constructor(p?: IValueTooSmallErrorParameters) {
    super(p);

    if (p.min) {
      switch (p.type) {
        case "string":
          this.message = `Value should contain more than ${p.min} characters`;

        case "array":
          this.message = `Value should contain more than ${p.min} items`;

        case "number":
        default:
          this.message = `Value should be more than ${p.min}`;
      }
    } else if (!p.message) {
      this.message = "Value is too small";
    }
  }
}

export interface IValueTooBigErrorParameters extends IOperationErrorParameters {
  max?: number;
  type?: DataType;
}

// tslint:disable-next-line: max-classes-per-file
export class ValueTooBigError extends OperationError {
  public name = "ValueTooBigError";

  constructor(p?: IValueTooBigErrorParameters) {
    super(p);

    if (p.max) {
      switch (p.type) {
        case "string":
          this.message = `Value should contain less than ${p.max} characters`;

        case "array":
          this.message = `Value should contain less than ${p.max} items`;

        case "number":
        default:
          this.message = `Value should be less than ${p.max}`;
      }
    } else if (!p.message) {
      this.message = "Value is too big";
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class InputNotUniqueError extends OperationError {
  public name = "InputNotUniqueError";
  public message = "Input is not unique";
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidInputError extends OperationError {
  public name = "InvalidInputError";
  public message = "Input is invalid";
}

// tslint:disable-next-line: max-classes-per-file
export class RequiredInputError extends OperationError {
  public name = "RequiredInputError";
  public message = "Input is required";
}
