import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import customPropertyValidationSchemas from "../validation";

export const updateOptionJoiSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    data: Joi.object()
        .keys({
            name: customPropertyValidationSchemas.name,
            description:
                customPropertyValidationSchemas.description.allow(null),
            color: validationSchemas.color.allow(null),
            prevOptionId: validationSchemas.uuid.allow(null),
        })
        .required(),
});
