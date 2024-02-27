import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const getBoardTasksJoiSchema = Joi.object()
  .keys({
    boardId: validationSchemas.resourceId.required(),
  })
  .required();
