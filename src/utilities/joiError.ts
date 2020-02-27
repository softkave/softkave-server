import Joi from "joi";
import get from "lodash/get";
import { InvalidEmailAddressError } from "../endpoints/user/errors";
import {
  InputNotUniqueError,
  InvalidValueError,
  RequiredInputError,
  ValueTooBigError,
  ValueTooSmallError
} from "./errors";
import { DataType } from "./types";

const limitPath = "details.0.context.limit";
const labelPath = "details.0.context.label";

function getDataInvalidErrorMessage() {
  return new InvalidValueError();
}

function getRequiredErrorMessage() {
  return new RequiredInputError();
}

function getMinErrorMessage(error: Joi.Err, type: DataType) {
  const min = get(error, limitPath);
  const message = get(error, labelPath);

  return new ValueTooSmallError({ message, min, type });
}

function getMaxErrorMessage(error: Joi.Err, type: DataType) {
  const max = get(error, limitPath);
  const message = get(error, labelPath);

  return new ValueTooBigError({ message, max, type });
}

function getUniqueErrorMessage() {
  return new InputNotUniqueError();
}

function getEmailErrorMessage() {
  return new InvalidEmailAddressError();
}

export const joiErrorMessages = {
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
