import Joi from "joi";
import organizationValidationSchemas from "../../organization/validation";
import boardValidationSchemas from "../validation";

export const boardExistsJoiSchema = Joi.object()
    .keys({
        name: organizationValidationSchemas.name.lowercase().required(),
        parent: boardValidationSchemas.parent.required(),
    })
    .required();
