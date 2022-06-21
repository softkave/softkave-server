import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import organizationValidationSchemas from "../validation";

export const updateBlockJoiSchema = Joi.object()
    .keys({
        data: Joi.object()
            .keys({
                name: organizationValidationSchemas.name,
                description: organizationValidationSchemas.description
                    .optional()
                    .allow(null),
                color: organizationValidationSchemas.color,
            })
            .required(),
        organizationId: validationSchemas.uuid.required(),
    })
    .required();
