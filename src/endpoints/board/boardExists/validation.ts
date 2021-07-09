import Joi from "joi";
import orgValidationSchemas from "../../org/validation";
import boardValidationSchemas from "../validation";

export const boardExistsJoiSchema = Joi.object().keys({
    name: orgValidationSchemas.name.lowercase().required(),
    parent: boardValidationSchemas.parent.required(),
});
