import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const transferTaskJoiSchema = Joi.object()
    .keys({
        taskId: validationSchemas.uuid.required(),
        boardId: validationSchemas.uuid.required(),
    })
    .required();
