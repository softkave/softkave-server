import Joi from "joi";
import blockValidationSchemas from "../validation";

export const blockExistsJoiSchema = Joi.object().keys({
  name: blockValidationSchemas.lowerCasedName,
  type: blockValidationSchemas.type,
  parent: blockValidationSchemas.parents
});
