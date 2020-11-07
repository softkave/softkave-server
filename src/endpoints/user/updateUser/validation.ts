import Joi from "joi";
import userValidationSchema from "../validation";

export const updateUserJoiSchema = Joi.object().keys({
    name: userValidationSchema.name.optional(),
    color: userValidationSchema.color.optional(),
    notificationsLastCheckedAt: Joi.date().optional(),
});
