import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import customPropertyValidationSchemas from "../validation";

export const createCustomSelectionOptionJoiSchema = Joi.object()
    .keys({
        propertyId: validationSchemas.uuid.required(),
        data: Joi.object()
            .keys({
                name: customPropertyValidationSchemas.name.required(),
                description:
                    customPropertyValidationSchemas.description.allow(null),
                color: validationSchemas.color.allow(null),
                prevOptionId: validationSchemas.uuid.allow(null),
                nextOptionId: validationSchemas.uuid.allow(null),
            })
            .required(),
    })
    .required();
