import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockChildrenJoiSchema = Joi.object().keys({
  customId: blockValidationSchemas.blockId,
  typeList: blockValidationSchemas.blockTypesList,
  useBoardId: Joi.boolean(),
});
