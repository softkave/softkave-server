import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import customPropertyValidationSchemas from "../validation";

export const updatePropertyEndpointJoiSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    property: {
        name: customPropertyValidationSchemas.name,
        description: customPropertyValidationSchemas.description.allow(null),
        type: customPropertyValidationSchemas.type,
        isRequired: customPropertyValidationSchemas.isRequired.allow(null),
        meta: customPropertyValidationSchemas.meta,
    },
});
