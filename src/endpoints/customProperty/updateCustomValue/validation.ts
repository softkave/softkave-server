import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import endpointValidationSchemas from "../../validation";
import customPropertyValidationSchemas from "../validation";

export const updateValueEndpointJoiSchema = Joi.object().keys({
    propertyId: validationSchemas.uuid.required(),
    parent: endpointValidationSchemas.parent.required(),
    type: customPropertyValidationSchemas.type.required(),
    data: Joi.object().keys({
        value: customPropertyValidationSchemas.value.required(),
    }),
});
