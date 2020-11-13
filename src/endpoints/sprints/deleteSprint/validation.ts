import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const deleteSprintJoiSchema = Joi.object().keys({
    sprintId: validationSchemas.uuid.required(),
});
