import Joi from "joi";
import organizationValidationSchemas from "../validation";

export const createOrganizationJoiSchema = Joi.object()
    .keys({
        organization: Joi.object()
            .keys({
                name: organizationValidationSchemas.name.required(),
                description: organizationValidationSchemas.description
                    .optional()
                    .allow(null),
                color: organizationValidationSchemas.color.required(),
            })
            .required(),
    })
    .required();
