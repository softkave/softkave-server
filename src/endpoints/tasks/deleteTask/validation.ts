import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const deleteTaskJoiSchema = Joi.object()
    .keys({
        taskId: validationSchemas.uuid.required(),
    })
    .required();
