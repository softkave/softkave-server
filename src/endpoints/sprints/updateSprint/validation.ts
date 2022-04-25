import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import sprintValidationSchemas from "../validation";

export const updateSprintJoiSchema = Joi.object().keys({
    sprintId: validationSchemas.uuid.required(),
    data: Joi.object()
        .keys({
            name: sprintValidationSchemas.name,
            duration: sprintValidationSchemas.sprintDuration,
            startDate: Joi.date().iso().allow(null),
            endDate: Joi.date().iso().allow(null),
        })
        .required(),
});
