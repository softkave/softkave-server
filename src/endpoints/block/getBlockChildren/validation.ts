import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockChildrenJoiSchema = Joi.object().keys({
  customId: blockValidationSchemas.blockID,
  types: blockValidationSchemas.blockTypesList
});
