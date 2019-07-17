import RequestError from "./RequestError";

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

export default serverError;
export { serverErrorFields, serverErrorMessages };
