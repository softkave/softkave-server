import Joi from "joi";
import blockValidationSchemas from "../validation";

export const transferBlockJoiSchema = Joi.object().keys({
  sourceBlock: blockValidationSchemas.blockID,
  draggedBlock: blockValidationSchemas.blockID,
  destinationBlock: blockValidationSchemas.blockID,
  dropPosition: Joi.number(),
  groupContext: blockValidationSchemas.groupContext
});
