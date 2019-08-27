class OperationError extends Error {
  public field: string;
  public message: string;
  public type: string;
  public action: string;

  constructor(type: string, message: string, field?: string, action?: string) {
    super(message);
    // errorField
    this.field = field;
    this.name = "OperationError";

    // errorType
    this.type = type;

    // clientAction
    this.action = action;

    // errorMessage
    // value
  }
}

export default OperationError;
