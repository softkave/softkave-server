import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const getCommentsJoiSchema = Joi.object().keys({
  taskId: validationSchemas.resourceId.required(),
});
