import Joi from "joi";
import orgValidationSchemas from "../validation";

export const createOrgJoiSchema = Joi.object().keys({
    org: Joi.object()
        .keys({
            name: orgValidationSchemas.name.required(),
            description: orgValidationSchemas.description,
            color: orgValidationSchemas.color.required(),
        })
        .required(),
});
