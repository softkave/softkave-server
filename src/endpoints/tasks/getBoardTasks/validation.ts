import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getBoardTasksJoiSchema = Joi.object()
    .keys({
        boardId: validationSchemas.uuid.required(),
    })
    .required();
