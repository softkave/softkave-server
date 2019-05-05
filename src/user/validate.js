const Joi = require("joi");
const { passwordPattern } = require("../validation-utils");
const {
  minNameLength,
  maxNameLength,
  minPasswordLength,
  maxPasswordLength
} = require("./constants");
const { validate } = require("../joi-utils");
const { transformPaths } = require("../utils");

module.exports = exports;

const emailSchema = Joi.string()
  .required()
  .email();

const passwordSchema = Joi.string()
  .required()
  .min(minPasswordLength)
  .max(maxPasswordLength)
  .regex(passwordPattern);

const nameSchema = Joi.string()
  .required()
  .min(minNameLength)
  .max(maxNameLength);

const userSignupSchema = Joi.object().keys({
  name: nameSchema,
  password: passwordSchema,
  email: emailSchema
});

const userUpdateSchema = Joi.object().keys({
  name: nameSchema,
  lastNotificationCheckTime: Joi.number().required()
});

const transformSchema = {
  email: { lowercase: true, trim: true }
};

exports.validateUserSignupData = function validateUserSignupData(data) {
  const value = validate(data, userSignupSchema);
  return transformPaths(value, transformSchema);
};

exports.validateEmail = function validateEmail(email) {
  const value = validate(email, emailSchema);
  return value.trim();
};

exports.validatePassword = function validatePassword(password) {
  const value = validate(password, passwordSchema);
  return value.trim();
};

exports.validateUserUpdateData = function validateUserUpdateData(data) {
  const value = validate(data, userUpdateSchema);
  return value;
};
