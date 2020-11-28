import Joi from "joi";
import { CollaborationRequestStatusType } from "../../mongo/notification";
import { regEx, validationSchemas } from "../../utilities/validationUtils";
import { userConstants } from "./constants";

const email = Joi.string().trim().lowercase().email();

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
    .valid([
        CollaborationRequestStatusType.Accepted,
        CollaborationRequestStatusType.Declined,
    ]);

const userValidationSchema = {
    name,
    email,
    password,
    collaborationRequestResponse,
    color: validationSchemas.color,
};

export default userValidationSchema;
