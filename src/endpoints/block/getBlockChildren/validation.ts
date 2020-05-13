import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockChildrenJoiSchema = Joi.object().keys({
  customId: blockValidationSchemas.blockID,
  typeList: blockValidationSchemas.blockTypesList,
  useBoardId: Joi.boolean(),
});
