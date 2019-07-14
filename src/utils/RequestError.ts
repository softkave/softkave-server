class RequestError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
    this.name = "RequestError";
  }
}

module.exports = {
  RequestError
};
export {};
