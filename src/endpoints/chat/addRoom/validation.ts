import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const addRoomJoiSchema = Joi.object()
  .keys({
    recipientId: validationSchemas.resourceId.required(),
    orgId: validationSchemas.resourceId.required(),
  })
  .required();
