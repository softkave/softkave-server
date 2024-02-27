import * as Joi from 'joi';
import {endpointValidationSchemas} from '../../validation';
import {INewOrganizationInput} from '../types';
import organizationValidationSchemas from '../validation';
import {ICreateOrganizationParameters} from './types';

export const createOrganizationJoiSchema = Joi.object<ICreateOrganizationParameters>()
  .keys({
    organization: Joi.object<INewOrganizationInput>()
      .keys({
        name: organizationValidationSchemas.name.required(),
        description: organizationValidationSchemas.description.optional().allow(null),
        color: organizationValidationSchemas.color.required(),
        visibility: endpointValidationSchemas.visibility,
      })
      .required(),
  })
  .required();
