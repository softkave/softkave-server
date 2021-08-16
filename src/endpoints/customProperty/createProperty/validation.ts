import Joi from "joi";
import endpointValidationSchemas from "../../validation";
import customPropertyValidationSchemas from "../validation";

export const createPropertyJoiSchema = Joi.object().keys({
    parent: endpointValidationSchemas.parent.required(),
    property: {
        name: customPropertyValidationSchemas.name.required(),
        description: customPropertyValidationSchemas.description.allow(null),
        type: customPropertyValidationSchemas.type.required(),
        isRequired: customPropertyValidationSchemas.isRequired.allow(null),
        meta: customPropertyValidationSchemas.meta.required(),
    },
});
