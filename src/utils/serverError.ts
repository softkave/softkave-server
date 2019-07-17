import OperationError from "./OperationError";

const serverErrorMessages = {
  serverError: "Server error"
};

const serverErrorFields = {
  server: "system.server",
  serverError: "system.server.serverError"
};

const serverError = {
  serverError: new OperationError(
    serverErrorFields.serverError,
    serverErrorMessages.serverError
  )
};

export default serverError;
export { serverErrorFields, serverErrorMessages };
