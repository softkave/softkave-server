import OperationError, { IOperationErrorParameters } from "./OperationError";

export interface IErrorListParameters extends IOperationErrorParameters {
  errors?: OperationError[];
}

export default class ErrorList extends OperationError {
  public errors: OperationError[] = [];
  public name = "ErrorList";
  public message = "Errors";

  constructor(p: IErrorListParameters) {
    super(p);

    this.errors = p.errors;
  }
}
