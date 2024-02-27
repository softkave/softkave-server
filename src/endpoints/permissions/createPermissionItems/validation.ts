import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {permissionValidationSchemas} from '../validation';
import {ICreatePermissionItemsEndpointParameters} from './types';

export const createPermissionItemsJoiSchema = Joi.object<ICreatePermissionItemsEndpointParameters>()
  .keys({
    organizationId: validationSchemas.resourceId.required(),
    items: Joi.array().items(permissionValidationSchemas.permissionItemInput).max(100).required(),
  })
  .required();
