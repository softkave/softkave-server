import Joi from "joi";
import isHexColor from "validator/lib/isHexColor";
import trim from "validator/lib/trim";

import { validate } from "./joi-utils";
import RequestError from "./RequestError";
import { validationErrorMessages } from "./validationError";

// const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
const passwordPattern = /[A-Za-z0-9!()?_`~#$^&*+=]/;
const stringPattern = /^[\w ]*$/;
const hexColorPattern = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/;

const regEx = {
  passwordPattern,
  stringPattern,
  hexColorPattern
};

const uuidSchema = Joi.string()
  .guid()
  .trim();

const joiSchemas = {
  uuidSchema
};

function validateUUID(uuid: string) {
  const value = validate(uuid, uuidSchema);
  return value;
}

function validateColor(
  field: string,
  color: string,
  message = validationErrorMessages.invalidColor
) {
  color = trim(color);

  if (!isHexColor(color)) {
    throw new RequestError(field, message);
  }
}

const validators = {
  validateUUID,
  validateColor
};

export { validators, regEx, joiSchemas };
