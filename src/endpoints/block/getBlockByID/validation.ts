import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockByIDJoiSchema = Joi.object().keys({
  blockID: blockValidationSchemas.blockID
});
