import Joi from "joi";
import userValidationSchemas from "../validation";

export const forganizationotPasswordJoiSchema = Joi.object().keys({
    email: userValidationSchemas.email.required(),
});
