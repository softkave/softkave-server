import Joi from "joi";
import userValidationSchema from "../validation";

export const forgotPasswordJoiSchema = Joi.object().keys({
  email: userValidationSchema.email
});
