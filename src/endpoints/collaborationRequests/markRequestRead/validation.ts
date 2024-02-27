import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const markRequestReadJoiSchema = Joi.object()
  .keys({
    requestId: validationSchemas.resourceId.required(),
  })
  .required();
