import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockCollaboratorsJoiSchema = Joi.object().keys({
  blockId: blockValidationSchemas.blockId,
});
