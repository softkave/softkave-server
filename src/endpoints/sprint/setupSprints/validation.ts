import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import sprintValidationSchemas from "../validation";

export const setupSprintsJoiSchema = Joi.object().keys({
    duration: sprintValidationSchemas.sprintDuration.required(),
    boardId: validationSchemas.uuid.required(),
});
