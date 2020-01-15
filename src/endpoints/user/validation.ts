import Joi from "joi";
import trim from "validator/lib/trim";
import { validate } from "../../utils/joiUtils";
import { regEx, validationSchemas } from "../../utils/validationUtils";
import { userConstants } from "./constants";

const email = Joi.string()
  .required()
  .trim()
  .lowercase()
  .email();

const password = Joi.string()
  .required()
  .trim()
  .min(userConstants.minPasswordLength)
  .max(userConstants.maxPasswordLength)
  .regex(regEx.passwordPattern);

const name = Joi.string()
  .required()
  .trim()
  .min(userConstants.minNameLength)
  .max(userConstants.maxNameLength);

const userValidationSchema = {
  name,
  email,
  password,
  color: validationSchemas.color
};

export default userValidationSchema;

export const updateUserSchema = Joi.object().keys({
  name: nameSchema,
  lastNotificationCheckTime: Joi.number().required()
});

export const collaborationRequestResponseSchema = Joi.string()
  .trim()
  .lowercase()
  .valid(["accepted", "declined"]);

export const collaborationRequestSchema = Joi.object().keys({
  readAt: Joi.number()
});

// TODO: define data's type
function trimUserData(data: any) {
  const trimmedData: any = {};

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

// TODO: define data's type
function validateUserSignupData(data: any) {
  const value = validate(data, userSignupSchema);
  return value;
}

function validateEmail(email: string) {
  const value = validate(email, emailSchema);
  return value;
}

function validatePassword(password: string) {
  const value = validate(password, passwordSchema);
  return value;
}

// TODO: define data's type
function validateUpdateUserData(data: any) {
  const value = validate(data, updateUserSchema);
  return value;
}

// TODO: define request's type
function validateCollaborationRequest(request: any) {
  return validate(request, collaborationRequestSchema);
}

function validateCollaborationRequestResponse(response: string) {
  return validate(response, collaborationRequestResponseSchema);
}

export {
  validateCollaborationRequest,
  validatePassword,
  validateEmail,
  validateUpdateUserData,
  validateUserSignupData,
  validateCollaborationRequestResponse,
  trimUserData
};
