import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import commentValidationSchemas from '../validation';

export const newComment = Joi.object().keys({
  customId: validationSchemas.resourceId.required(),
  taskId: validationSchemas.resourceId.required(),
  comment: commentValidationSchemas.comment.required(),
});
