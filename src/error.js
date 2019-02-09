class RequestError extends Error() {
  constructor(field, message) {
    this.field = field;
    this.message = message;
    this.name = 'RequestError';
  }
}

module.exports = {
  RequestError
};