import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockCollaboratorsJoiSchema = Joi.object().keys({
  customId: blockValidationSchemas.blockID
});
