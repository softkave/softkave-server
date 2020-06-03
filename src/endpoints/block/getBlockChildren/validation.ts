import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockChildrenJoiSchema = Joi.object().keys({
  blockId: blockValidationSchemas.blockId,
  typeList: blockValidationSchemas.blockTypesList,
});
