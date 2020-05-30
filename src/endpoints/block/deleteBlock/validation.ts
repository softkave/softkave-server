import Joi from "joi";
import blockValidationSchemas from "../validation";

export const deleteBlockJoiSchema = Joi.object().keys({
  customId: blockValidationSchemas.blockId,
});
