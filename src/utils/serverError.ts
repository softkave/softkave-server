const { RequestError } = require("./error");

const serverErrorMessages = {
  serverError: "Server error"
};

const serverErrorFields = {
  server: "system.server",
  serverError: "system.server.serverError"
};

const serverError = {
  serverError: new RequestError(
    serverErrorFields.serverError,
    serverErrorMessages.serverError
  )
};

module.exports = {
  serverError,
  serverErrorFields,
  serverErrorMessages
};
export {};
