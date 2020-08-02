import Joi from "joi";
import commentsSchema from "../../mongo/comment/definitions";
import { validationSchemas } from "../../utilities/validationUtils";

const commentId = validationSchemas.uuid;
const comment = Joi.string().allow("").max(1000).trim();

const newComment = Joi.object().keys({
  customId: commentId.required(),
  taskId: validationSchemas.uuid.required(),
  comment: comment.required(),
});

const commentValidationSchemas = {
  newComment,
};

export default commentValidationSchemas;
