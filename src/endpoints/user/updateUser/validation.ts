import Joi from "joi";
import userValidationSchema from "../validation";

export const loginJoiSchema = Joi.object().keys({
  email: userValidationSchema.email,
  name: userValidationSchema.name,
  color: userValidationSchema.color,

  // TODO: look into the min, and check other number schemas, and see if they have the right limits
  lastNotificationCheckTime: Joi.number().min(0)
});
