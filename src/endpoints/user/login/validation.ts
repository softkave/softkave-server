import Joi from "joi";
import userValidationSchema from "../validation";

export const loginJoiSchema = Joi.object().keys({
    email: userValidationSchema.email.required(),
    password: userValidationSchema.password,
});
