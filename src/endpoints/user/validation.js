const Joi = require("joi");
const trim = require("validator/lib/trim");

const { regEx } = require("../../utils/validation-utils");
const { constants: userConstants } = require("./constants");
const { validate } = require("../../utils/joi-utils");

const emailSchema = Joi.string()
  .required()
  .trim(true)
  .lowercase()
  .email();

const passwordSchema = Joi.string()
  .required()
  .trim(true)
  .min(userConstants.minPasswordLength)
  .max(userConstants.maxPasswordLength)
  .regex(regEx.passwordPattern);

const nameSchema = Joi.string()
  .required()
  .trim(true)
  .min(userConstants.minNameLength)
  .max(userConstants.maxNameLength);

const userSignupSchema = Joi.object().keys({
  name: nameSchema,
  password: passwordSchema,
  email: emailSchema,
  color: Joi.string()
    .trim(true)
    .lowercase()
    .regex(regEx.hexColorPattern)
});

const updateUserSchema = Joi.object().keys({
  name: nameSchema,
  lastNotificationCheckTime: Joi.number().required()
});

const collaborationRequestResponseSchema = Joi.string()
  .trim(true)
  .lowercase()
  .valid(["accepted", "declined"]);

const collaborationRequestSchema = Joi.object().keys({
  readAt: Joi.number()
});

function trimUserData(data) {
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
}

function validateUserSignupData(data) {
  const value = validate(data, userSignupSchema);
  return value;
}

function validateEmail(email) {
  const value = validate(email, emailSchema);
  return value;
}

function validatePassword(password) {
  const value = validate(password, passwordSchema);
  return value;
}

function validateUpdateUserData(data) {
  const value = validate(data, updateUserSchema);
  return value;
}

function validateCollaborationRequest(request) {
  return validate(request, collaborationRequestSchema);
}

function validateCollaborationRequestResponse(response) {
  return validate(response, collaborationRequestResponseSchema);
}

module.exports = {
  validateCollaborationRequest,
  validatePassword,
  validateEmail,
  validateUpdateUserData,
  validateUserSignupData,
  validateCollaborationRequestResponse,
  trimUserData
};
