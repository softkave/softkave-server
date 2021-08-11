import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import customPropertyValidationSchemas from "../validation";

export const createCustomSelectionOptionJoiSchema = Joi.object()
    .keys({
        propertyId: validationSchemas.uuid.required(),
        data: Joi.object()
            .keys({
                name: customPropertyValidationSchemas.name.required(),
                description: customPropertyValidationSchemas.description,
                color: validationSchemas.color,
                prevOptionId: validationSchemas.uuid,
                nextOptionId: validationSchemas.uuid,
            })
            .required(),
    })
    .required();
