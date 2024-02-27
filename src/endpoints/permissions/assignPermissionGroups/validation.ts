import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {permissionValidationSchemas} from '../validation';
import {IAssignPermissionGroupInputItem, IAssignPermissionGroupsEndpointParameters} from './types';

export const assignPermissionGroupItemJoiSchema = Joi.object<IAssignPermissionGroupInputItem>()
  .keys({
    permissionGroupId: validationSchemas.resourceId.required(),
    entity: permissionValidationSchemas.permissionItemEntity.required(),
    order: Joi.number().integer().min(0),
  })
  .required();
export const assignPermissionGroupsJoiSchema =
  Joi.object<IAssignPermissionGroupsEndpointParameters>()
    .keys({
      organizationId: validationSchemas.resourceId.required(),
      items: Joi.array().items(assignPermissionGroupItemJoiSchema).max(100).required(),
    })
    .required();
