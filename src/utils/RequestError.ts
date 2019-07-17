class RequestError extends Error {
  public field: string;
  public message: string;

  constructor(field: string, message: string) {
    super(message);
    this.field = field;
    this.name = "RequestError";
  }
}

export default RequestError;
