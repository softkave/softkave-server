import Joi from "joi";
import trim from "validator/lib/trim";
import { userConstants } from "../../endpoints/user/constants";
import { validate } from "../../utilities/joiUtils";
import { regEx } from "../../utilities/validationUtils";

export const emailSchema = Joi.string()
  .required()
  .trim()
  .lowercase()
  .email();

export const passwordSchema = Joi.string()
  .required()
  .trim()
  .min(userConstants.minPasswordLength)
  .max(userConstants.maxPasswordLength)
  .regex(regEx.passwordPattern);

export const nameSchema = Joi.string()
  .required()
  .trim()
  .min(userConstants.minNameLength)
  .max(userConstants.maxNameLength);

export const userSignupSchema = Joi.object().keys({
  name: nameSchema,
  password: passwordSchema,
  email: emailSchema,
  color: Joi.string()
    .trim()
    .lowercase()
    .regex(regEx.hexColorPattern)
});

export const updateUserSchema = Joi.object().keys({
  name: nameSchema,
  lastNotificationCheckTime: Joi.number().required()
});

export const collaborationRequestResponseSchema = Joi.string()
  .trim()
  .lowercase()
  .valid(["accepted", "declined"]);
