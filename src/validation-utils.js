const Joi = require("joi");
const { validate } = require("./joi-utils");

module.exports = exports;

exports.passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
exports.stringPattern = /^[\w ]*$/;

// exports.makeMinLengthErrorMessage = function makeMinLengthErrorMessage(
//   field,
//   length,
//   type = "character(s)"
// ) {
//   `minimum of ${length} ${type} required for ${field}`;
// };

// exports.makeMaxLengthErrorMessage = function makeMaxLengthErrorMessage(
//   field,
//   length,
//   type = "character(s)"
// ) {
//   return `maximum of ${length} ${type} expected for ${field}`;
// };

// exports.makeRequiredErrorMessage = function makeRequiredErrorMessage(field) {
//   return `${field} is required`;
// };

const uuidSchema = Joi.string().guid();

exports.uuidSchema = uuidSchema;
exports.validateUUID = function validateUUID(uuid) {
  const value = validate(uuid, uuidSchema);
  return value.trim();
};
