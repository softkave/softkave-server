import Joi from "joi";
import { validationSchemas } from "utils/validationUtils";
import blockValidationSchemas from "../validation";

export const revokeRequestJoiSchema = Joi.object().keys({
  requestID: validationSchemas.uuid,
  blockID: blockValidationSchemas.blockID
});
