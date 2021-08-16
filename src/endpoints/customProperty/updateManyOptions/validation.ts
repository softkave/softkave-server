import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { customPropertyConstants } from "../constants";
import customPropertyValidationSchemas from "../validation";

const option = Joi.object()
    .keys({
        customId: validationSchemas.uuid.required(),
        data: Joi.object()
            .keys({
                name: customPropertyValidationSchemas.name,
                description:
                    customPropertyValidationSchemas.description.allow(null),
                color: validationSchemas.color.allow(null),
                prevOptionId: validationSchemas.uuid.allow(null),
                nextOptionId: validationSchemas.uuid.allow(null),
            })
            .required(),
    })
    .required();

export const updateManyOptionsJoiSchema = Joi.object().keys({
    options: Joi.array()
        .items(option)
        .min(1)
        .max(customPropertyConstants.maxUpdateOptionsCount)
        .required(),
});
