import Joi from "joi";
import userValidationSchemas from "../validation";

export const newUserInputSchema = Joi.object().keys({
    name: userValidationSchemas.name.required(),
    password: userValidationSchemas.password.required(),
    email: userValidationSchemas.email.required(),
    color: userValidationSchemas.color.required(),
});
