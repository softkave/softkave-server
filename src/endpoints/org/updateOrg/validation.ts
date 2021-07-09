import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import orgValidationSchemas from "../validation";

export const updateBlockJoiSchema = Joi.object()
    .keys({
        data: Joi.object()
            .keys({
                name: orgValidationSchemas.name,
                description: orgValidationSchemas.description
                    .optional()
                    .allow([null]),
                color: orgValidationSchemas.color,
            })
            .required(),
        orgId: validationSchemas.uuid.required(),
    })
    .required();
