import Joi from "joi";
import userValidationSchemas from "../validation";

export const updateUserJoiSchema = Joi.object().keys({
    name: userValidationSchemas.name.optional(),
    color: userValidationSchemas.color.optional(),
    notificationsLastCheckedAt: Joi.date().optional(),
    email: userValidationSchemas.email,
    password: userValidationSchemas.password,
});
