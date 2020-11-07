import Joi from "joi";
import userValidationSchema from "../validation";

export const newUserInputSchema = Joi.object().keys({
    name: userValidationSchema.name,
    password: userValidationSchema.password,
    email: userValidationSchema.email,
    color: userValidationSchema.color.required(),
});
