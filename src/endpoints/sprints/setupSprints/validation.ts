import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import sprintValidationSchemas from "../validation";

export const setupSprintsJoiSchema = Joi.object().keys({
    boardId: validationSchemas.uuid.required(),
    data: Joi.object()
        .keys({
            duration: sprintValidationSchemas.sprintDuration.required(),
        })
        .required(),
});