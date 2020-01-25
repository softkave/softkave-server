import Joi from "joi";
import { validationSchemas } from "utils/validationUtils";

export const revokeRequestJoiSchema = Joi.object().keys({
  requestID: validationSchemas.uuid
});
