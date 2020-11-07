import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import commentValidationSchemas from "../validation";

export const newComment = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    taskId: validationSchemas.uuid.required(),
    comment: commentValidationSchemas.comment.required(),
});
