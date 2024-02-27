import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const getTaskJoiSchema = Joi.object()
  .keys({
    taskId: validationSchemas.resourceId.required(),
  })
  .required();
