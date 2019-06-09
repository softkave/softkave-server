const Joi = require("joi");
const { validate } = require("./joi-utils");
const isHexColor = require("validator/lib/isHexColor");
const { RequestError } = require("./error");

module.exports = exports;

// exports.passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
exports.passwordPattern = /[A-Za-z0-9!()?_`~#$^&*+=]/;
exports.stringPattern = /^[\w ]*$/;
exports.hexColorRegEx = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/;

const uuidSchema = Joi.string()
  .guid()
  .trim(true);
exports.uuidSchema = uuidSchema;

exports.validateUUID = function validateUUID(uuid) {
  const value = validate(uuid, uuidSchema);
  return value;
};

exports.validateColor = function validateColor(
  field,
  color,
  message = "color data is invalid"
) {
  color = trim(color);

  if (!isHexColor(color)) {
    throw new RequestError(field, message);
  }
};
