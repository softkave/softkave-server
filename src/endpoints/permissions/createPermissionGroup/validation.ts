import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {permissionValidationSchemas} from '../validation';
import {ICreatePermissionGroupEndpointParameters} from './types';

export const createPermissionGroupJoiSchema = Joi.object<ICreatePermissionGroupEndpointParameters>()
  .keys({
    organizationId: validationSchemas.resourceId.required(),
    permissionGroup: permissionValidationSchemas.permissionGroupInput.required(),
  })
  .required();
