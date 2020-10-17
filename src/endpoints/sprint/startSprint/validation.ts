import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const startSprintJoiSchema = Joi.object().keys({
    sprintId: validationSchemas.uuid.required(),
});
