class OperationError extends Error {
  public field: string;
  public message: string;
  public type: string;
  public action: string;

  constructor(message: string, type: string, field?: string, action?: string) {
    super(message);
    this.field = field;
    this.name = "OperationError";
    this.type = type;
    this.action = action;
  }
}

export default OperationError;
