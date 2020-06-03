import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockCollaborationRequestsJoiSchema = Joi.object().keys({
  blockId: blockValidationSchemas.blockId,
});
