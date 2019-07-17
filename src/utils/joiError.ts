import Joi from "joi";
import get from "lodash/get";

import { userErrorMessages } from "../endpoints/user/userError";
import {
  getErrorMessageWithMax,
  getErrorMessageWithMin,
  validationErrorMessages
} from "./validationError";

const limitPath = "details.0.context.limit";
const labelPath = "details.0.context.label";

// define all any
function getDataInvalidErrorMessage() {
  return validationErrorMessages.dataInvalid;
}

function getRequiredErrorMessage() {
  return validationErrorMessages.requiredError;
}

function getMinErrorMessage(error: Joi.Err, type: any) {
  const min = get(error, limitPath);
  const label = get(error, labelPath);

  if (!min || !label) {
    return getDataInvalidErrorMessage();
  }

  return getErrorMessageWithMin(min, type);
}

function getMaxErrorMessage(error: any, type: any) {
  const max = get(error, limitPath);
  const label = get(error, labelPath);

  if (!max || !label) {
    return getDataInvalidErrorMessage();
  }

  return getErrorMessageWithMax(max, type);
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
  "any.allowOnly": getDataInvalidErrorMessage,
  "string.base": getDataInvalidErrorMessage,
  "string.min": (error: any) => getMinErrorMessage(error, "string"),
  "string.max": (error: any) => getMaxErrorMessage(error, "string"),
  "string.regex.base": getDataInvalidErrorMessage,
  "string.email": getEmailErrorMessage,
  "string.guid": getDataInvalidErrorMessage,
  "number.base": getDataInvalidErrorMessage,
  "number.min": (error: any) => getMinErrorMessage(error, "number"),
  "number.max": (error: any) => getMaxErrorMessage(error, "number"),
  "array.base": getDataInvalidErrorMessage,
  "array.unique": getUniqueErrorMessage,
  "array.min": (error: any) => getMinErrorMessage(error, "array"),
  "array.max": (error: any) => getMaxErrorMessage(error, "array")
};

export { joiErrorMessages };
