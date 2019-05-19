const Joi = require("joi");
const { passwordPattern, uuidSchema } = require("../validation-utils");
const {
  minNameLength,
  maxNameLength,
  minPasswordLength,
  maxPasswordLength
} = require("./constants");
const { validate } = require("../joi-utils");
const trim = require("validator/lib/trim");

module.exports = exports;

const emailSchema = Joi.string()
  .required()
  .trim(true)
  .lowercase()
  .email();

const passwordSchema = Joi.string()
  .required()
  .trim(true)
  .min(minPasswordLength)
  .max(maxPasswordLength)
  .regex(passwordPattern);

const nameSchema = Joi.string()
  .required()
  .trim(true)
  .min(minNameLength)
  .max(maxNameLength);

const userSignupSchema = Joi.object().keys({
  name: nameSchema,
  password: passwordSchema,
  email: emailSchema
});

const updateUserSchema = Joi.object().keys({
  name: nameSchema,
  lastNotificationCheckTime: Joi.number().required()
});

const respondToCollaborationRequestSchema = Joi.object().keys({
  response: Joi.string()
    .trim(true)
    .lowercase()
    .valid(["accepted", "declined"]),
  customId: uuidSchema
});

const collaborationRequestSchema = Joi.object().keys({
  readAt: Joi.number()
});

exports.trimUserData = function trimUserData(data) {
  const trimmedData = {};

  if (data.name) {
    trimmedData.name = trim(data.name);
  }

  if (data.password) {
    trimmedData.password = trim(data.password);
  }

  if (data.email) {
    trimmedData.email = trim(data.email);
  }

  return trimmedData;
};

exports.validateUserSignupData = function validateUserSignupData(data) {
  const value = validate(data, userSignupSchema);
  return value;
};

exports.validateEmail = function validateEmail(email) {
  const value = validate(email, emailSchema);
  return value;
};

exports.validatePassword = function validatePassword(password) {
  const value = validate(password, passwordSchema);
  return value;
};

exports.validateUpdateUserData = function validateUpdateUserData(data) {
  const value = validate(data, updateUserSchema);
  return value;
};

exports.validateRespondToCollaborationRequest = function validateRespondToCollaborationRequest(
  params
) {
  return validate(params, respondToCollaborationRequestSchema);
};

exports.validateCollaborationRequest = function validateCollaborationRequest(
  request
) {
  return validate(request, collaborationRequestSchema);
};
