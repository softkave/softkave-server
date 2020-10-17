import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const endSprintJoiSchema = Joi.object().keys({
    sprintId: validationSchemas.uuid.required(),
});
