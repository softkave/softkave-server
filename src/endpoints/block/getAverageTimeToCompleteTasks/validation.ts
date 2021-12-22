import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getAverageTimeToCompleteTasksJoiSchema = Joi.object().keys({
    boardId: validationSchemas.uuid.required(),
});
