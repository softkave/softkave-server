const Joi = require("joi");
const isHexColor = require("validator/lib/isHexColor");

const { validate } = require("./joi-utils");
const { RequestError } = require("./error");
const { errorMessages } = require("./errorMessages");

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
  .trim(true);

const joiSchemas = {
  uuidSchema
};

function validateUUID(uuid) {
  const value = validate(uuid, uuidSchema);
  return value;
}

function validateColor(field, color, message = errorMessages.invalidColor) {
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
