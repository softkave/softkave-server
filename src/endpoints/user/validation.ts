import Joi from "joi";
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

const collaborationRequestResponse = Joi.string()
  .trim()
  .lowercase()
  .valid(["accepted", "declined"]);

const userValidationSchema = {
  name,
  email,
  password,
  collaborationRequestResponse,
  color: validationSchemas.color
};

export default userValidationSchema;
