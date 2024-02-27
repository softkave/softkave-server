import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import chatValidationSchemas from '../validations';

export const sendMessageJoiSchema = Joi.object().keys({
  orgId: validationSchemas.resourceId.required(),
  message: chatValidationSchemas.message.required(),
  roomId: validationSchemas.resourceId.required(),
  localId: validationSchemas.resourceId,
});
