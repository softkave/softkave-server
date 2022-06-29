import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getTaskJoiSchema = Joi.object()
  .keys({
    taskId: validationSchemas.uuid.required(),
  })
  .required();
