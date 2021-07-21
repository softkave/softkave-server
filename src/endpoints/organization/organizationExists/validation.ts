import Joi from "joi";
import organizationValidationSchemas from "../validation";

export const organizationExistsJoiSchema = Joi.object()
    .keys({
        name: organizationValidationSchemas.name.lowercase().required(),
    })
    .required();
