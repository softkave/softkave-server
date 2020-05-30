import Joi from "joi";
import blockValidationSchemas from "../validation";

export const transferBlockJoiSchema = Joi.object().keys({
  draggedBlockId: blockValidationSchemas.blockId.required(),
  destinationBlockId: blockValidationSchemas.blockId.required(),
});
