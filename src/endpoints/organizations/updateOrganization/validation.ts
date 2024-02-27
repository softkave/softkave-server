import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {endpointValidationSchemas} from '../../validation';
import organizationValidationSchemas from '../validation';
import {IUpdateOrganizationInput, IUpdateOrganizationParameters} from './types';

export const updateBlockJoiSchema = Joi.object<IUpdateOrganizationParameters>()
  .keys({
    data: Joi.object<IUpdateOrganizationInput>()
      .keys({
        name: organizationValidationSchemas.name,
        description: organizationValidationSchemas.description.optional().allow(null),
        color: organizationValidationSchemas.color,
        visibility: endpointValidationSchemas.visibility,
      })
      .required(),
    organizationId: validationSchemas.resourceId.required(),
  })
  .required();
