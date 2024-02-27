import * as Joi from 'joi';
import userValidationSchemas from '../validation';
import {INewUserInput} from './types';

export const newUserInputSchema = Joi.object<INewUserInput>().keys({
  firstName: userValidationSchemas.name.required(),
  lastName: userValidationSchemas.name.required(),
  password: userValidationSchemas.password.required(),
  email: userValidationSchemas.email.required(),
  color: userValidationSchemas.color.required(),
});
