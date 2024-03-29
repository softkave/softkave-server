import * as Joi from 'joi';
import taskValidationSchemas from '../../tasks/validation';
import userValidationSchemas from '../../user/validation';

export const sendFeedbackJoiSchema = Joi.object().keys({
  feedback: taskValidationSchemas.name.required(),
  description: taskValidationSchemas.description,
  notifyEmail: userValidationSchemas.email.allow(null),
});
