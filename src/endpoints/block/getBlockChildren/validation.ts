import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockChildrenJoiSchema = Joi.object().keys({
  blockID: blockValidationSchemas.blockID,
  types: blockValidationSchemas.blockTypesList
});