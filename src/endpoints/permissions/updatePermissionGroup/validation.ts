import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {permissionValidationSchemas} from '../validation';
import {IUpdatePermissionGroupEndpointParameters} from './types';

export const updatePermissionGroupJoiSchema = Joi.object<IUpdatePermissionGroupEndpointParameters>()
  .keys({
    permissionGroupId: validationSchemas.resourceId.required(),
    permissionGroup: permissionValidationSchemas.permissionGroupInput.required(),
  })
  .required();
