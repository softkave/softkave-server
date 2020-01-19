import Joi from "joi";
import userValidationSchema from "../validation";

export const changePasswordJoiSchema = Joi.object().keys({
  password: userValidationSchema.password
});
