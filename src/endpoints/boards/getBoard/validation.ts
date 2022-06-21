import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getBoardJoiSchema = Joi.object()
    .keys({
        boardId: validationSchemas.uuid.required(),
    })
    .required();
