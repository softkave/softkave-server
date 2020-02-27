export interface IOperationErrorParameters {
  message?: string;
  field?: string;
  action?: string;
}

class OperationError extends Error {
  public field: string;
  public message: string;
  public action: string;
  public name = "OperationError";

  constructor(p: IOperationErrorParameters = {}) {
    super(p.message);

    // error data path
    this.field = p.field;

    // recommended action for the client
    this.action = p.action;
  }
}

export default OperationError;
