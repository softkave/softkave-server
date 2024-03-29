import * as Joi from 'joi';
import {CollaborationRequestStatusType} from '../../mongo/collaboration-request/definitions';
import {regEx, validationSchemas} from '../../utilities/validationUtils';
import {userConstants} from './constants';

const email = Joi.string().trim().email();
const password = Joi.string()
  .trim()
  .min(userConstants.minPasswordLength)
  .max(userConstants.maxPasswordLength)
  .regex(regEx.passwordPattern);

const name = Joi.string().trim().min(userConstants.minNameLength).max(userConstants.maxNameLength);
const collaborationRequestResponse = Joi.string()
  .trim()
  .lowercase()
  .valid(CollaborationRequestStatusType.Accepted, CollaborationRequestStatusType.Declined);

const userValidationSchemas = {
  name,
  email,
  password,
  collaborationRequestResponse,
  color: validationSchemas.color,
};

export default userValidationSchemas;
