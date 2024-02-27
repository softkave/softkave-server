import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const deleteBoardJoiSchema = Joi.object()
  .keys({
    boardId: validationSchemas.resourceId.required(),
  })
  .required();
