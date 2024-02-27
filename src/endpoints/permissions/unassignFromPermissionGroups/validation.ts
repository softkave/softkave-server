import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {permissionValidationSchemas} from '../validation';
import {
  IUnassignPermissionGroupInputItem,
  IUnassignPermissionGroupsEndpointParameters,
} from './types';

export const unassignPermissionGroupItemJoiSchema = Joi.object<IUnassignPermissionGroupInputItem>()
  .keys({
    permissionGroupId: validationSchemas.resourceId.required(),
    entity: permissionValidationSchemas.permissionItemEntity.required(),
  })
  .required();
export const unassignPermissionGroupsJoiSchema =
  Joi.object<IUnassignPermissionGroupsEndpointParameters>()
    .keys({
      organizationId: validationSchemas.resourceId.required(),
      items: Joi.array().items(unassignPermissionGroupItemJoiSchema).max(100).required(),
    })
    .required();
