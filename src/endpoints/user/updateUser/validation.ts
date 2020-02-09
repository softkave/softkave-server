import Joi from "joi";
import userValidationSchema from "../validation";

export const updateUserJoiSchema = Joi.object().keys({
  email: userValidationSchema.email.optional(),
  name: userValidationSchema.name.optional(),
  color: userValidationSchema.color.optional(),

  // TODO: look into the min, and check other number schemas, and see if they have the right limits
  lastNotificationCheckTime: Joi.number()
    .min(0)
    .optional()
});
