import Joi = require('joi');
import {IPermissionGroupContainer} from '../../mongo/access-control/permissionGroup';
import {
  IPermissionItemCondition,
  IPermissionItemEntity,
  IPermissionItemTarget,
} from '../../mongo/access-control/permissionItem';
import {validationSchemas} from '../../utilities/validationUtils';
import {IPermissionGroupInput, IPermissionItemInput} from '../contexts/data/permission/type';
import {endpointValidationSchemas} from '../validation';

const permissionGroupContainer = Joi.object<IPermissionGroupContainer>({
  containerType: endpointValidationSchemas.systemResourceType.required(),
  containerId: validationSchemas.resourceId.required(),
});
const permissionGroupInput = Joi.object<IPermissionGroupInput>({
  name: endpointValidationSchemas.name.required(),
  description: endpointValidationSchemas.description.allow(null),
  container: permissionGroupContainer.required(),
});

const permissionItemTarget = Joi.object<IPermissionItemTarget>({
  targetType: endpointValidationSchemas.systemResourceType.required(),
  targetId: validationSchemas.resourceId.required(),
});
const permissionItemEntity = Joi.object<IPermissionItemEntity>({
  entityType: endpointValidationSchemas.systemResourceType.required(),
  entityId: validationSchemas.resourceId.required(),
});
const permissionItemCondition = Joi.object<IPermissionItemCondition>({
  field: Joi.string().max(100).required(),
  is: Joi.string().max(1000).required(),
  on: Joi.string().valid('entity', 'target').required(),
  actionTargetType: endpointValidationSchemas.systemResourceType.required(),
  actionEntityType: endpointValidationSchemas.systemResourceType.required(),
});

// TODO: list out actions
const permissionItemAction = Joi.string().max(30).required();
const permissionItemInput = Joi.object<IPermissionItemInput>({
  entity: permissionItemEntity.required(),
  target: permissionItemTarget.required(),
  action: permissionItemAction.required(),
  allow: Joi.boolean().required(),
  conditions: Joi.array().items(permissionItemCondition).max(10),
});

export const permissionValidationSchemas = {
  permissionGroupInput,
  permissionItemInput,
  permissionItemTarget,
  permissionItemEntity,
  permissionItemAction,
  permissionGroupContainer,
};
