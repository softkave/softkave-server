import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import userValidationSchemas from '../../user/validation';

export const respondToCollaborationRequestJoiSchema = Joi.object().keys({
  requestId: validationSchemas.resourceId.required(),
  response: userValidationSchemas.collaborationRequestResponse.required(),
});
