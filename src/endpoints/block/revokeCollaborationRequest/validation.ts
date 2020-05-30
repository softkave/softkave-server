import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import blockValidationSchemas from "../validation";

export const revokeRequestJoiSchema = Joi.object().keys({
  requestId: validationSchemas.uuid,
  blockId: blockValidationSchemas.blockId,
});
