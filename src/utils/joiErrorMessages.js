const {
  errorMessages: validationErrorMessages
} = require("./validationErrorMessages");
const { errorMessages: userErrorMessages } = require("./userErrorMessages");

const limitPath = "details.0.context.limit";
const labelPath = "details.0.context.label";

function getDataInvalidErrorMessage() {
  return validationErrorMessages.dataInvalid;
}

function getRequiredErrorMessage() {
  return validationErrorMessages.requiredError;
}

function getMinErrorMessage(error) {
  const min = get(error, limitPath);
  const label = get(error, labelPath);

  if (!min || !label) {
    return getDataInvalidErrorMessage();
  }

  return `Input must be at least ${min} in length`;
}

function getMaxErrorMessage(error) {
  const max = get(error, limitPath);
  const label = get(error, labelPath);

  if (!max || !label) {
    return getDataInvalidErrorMessage();
  }

  return `Input must be less than ${max}`;
}

function getUniqueErrorMessage() {
  return validationErrorMessages.notUniqueError;
}

function getEmailErrorMessage() {
  return userErrorMessages.invalidEmail;
}

const joiErrorMessages = {
  "any.required": getRequiredErrorMessage,
  "any.empty": getRequiredErrorMessage,
  "any.allowOnly": getDefaultErrorMessage,
  "string.base": getDefaultErrorMessage,
  "string.min": getMinErrorMessage,
  "string.max": getMaxErrorMessage,
  "string.regex.base": getDefaultErrorMessage,
  "string.email": getEmailErrorMessage,
  "string.guid": getDefaultErrorMessage,
  "number.base": getDefaultErrorMessage,
  "number.min": getMinErrorMessage,
  "number.max": getMaxErrorMessage,
  "array.base": getDefaultErrorMessage,
  "array.unique": getUniqueErrorMessage,
  "array.min": getMinErrorMessage,
  "array.max": getMaxErrorMessage
};

module.exports = { joiErrorMessages };
