export interface IOperationErrorParameters {
  message?: string;
  field?: string;
  action?: string;
  value?: any;
}

class OperationError extends Error {
  public message: string;
  public field?: string;
  public action?: string;
  public value?: string;
  public isPublic = true;
  public defaultMessage = "Operation error";

  constructor(p: IOperationErrorParameters = {}) {
    super(p.message);
    this.message = p.message || this.defaultMessage;

    // error data path
    this.field = p.field;

    // recommended action for the client
    this.action = p.action;

    if (p.value) {
      this.value = JSON.stringify(p.value);
    }
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
