import Joi from "joi";
import blockValidationSchemas from "../validation";

export const blockExistsJoiSchema = Joi.object().keys({
    name: blockValidationSchemas.name.lowercase(),
    type: blockValidationSchemas.fullBlockType,
    parent: blockValidationSchemas.parent,
});
