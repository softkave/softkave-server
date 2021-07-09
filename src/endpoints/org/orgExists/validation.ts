import Joi from "joi";
import orgValidationSchemas from "../validation";

export const orgExistsJoiSchema = Joi.object().keys({
    name: orgValidationSchemas.name.lowercase().required(),
});
