import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import organizationValidationSchemas from '../../organizations/validation';
import {IBoardExistsParameters} from './types';

export const boardExistsJoiSchema = Joi.object<IBoardExistsParameters>()
  .keys({
    name: organizationValidationSchemas.name.required(),
    parent: validationSchemas.resourceId.required(),
  })
  .required();
