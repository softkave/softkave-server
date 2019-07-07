const { RequestError } = require("./error");

const errorMessages = {
  serverError: "Server error"
};

const errorFields = {
  server: "system.server",
  serverError: "system.server.serverError"
};

const errors = {
  serverError: new RequestError(
    errorFields.serverError,
    errorMessages.serverError
  )
};

module.exports = {
  errors,
  errorFields,
  errorMessages
};
