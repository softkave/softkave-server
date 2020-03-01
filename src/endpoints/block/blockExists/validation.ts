import Joi from "joi";
import blockValidationSchemas from "../validation";

export const blockExistsJoiSchema = Joi.object()
  .keys({
    name: blockValidationSchemas.lowerCasedName,
    type: blockValidationSchemas.fullBlockType,
    parent: blockValidationSchemas.parent
  })
  .unknown(true);
