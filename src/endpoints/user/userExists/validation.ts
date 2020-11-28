import Joi from "joi";
import userValidationSchema from "../validation";

export const userExistsJoiSchema = Joi.object().keys({
    email: userValidationSchema.email.required(),
});
