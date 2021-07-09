import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const deleteBoardJoiSchema = Joi.object().keys({
    boardId: validationSchemas.uuid.required(),
});
