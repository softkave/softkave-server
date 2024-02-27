import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const transferTaskJoiSchema = Joi.object()
  .keys({
    taskId: validationSchemas.resourceId.required(),
    boardId: validationSchemas.resourceId.required(),
  })
  .required();
