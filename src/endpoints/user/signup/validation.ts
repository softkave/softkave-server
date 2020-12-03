import Joi from "joi";
import userValidationSchemas from "../validation";

export const newUserInputSchema = Joi.object().keys({
    name: userValidationSchemas.name,
    password: userValidationSchemas.password,
    email: userValidationSchemas.email.required(),
    color: userValidationSchemas.color.required(),
});
