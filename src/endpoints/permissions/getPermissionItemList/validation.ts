import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {permissionValidationSchemas} from '../validation';
import {IGetPermissionItemListEndpointParameters} from './types';

export const getPermissionItemListJoiSchema = Joi.object<IGetPermissionItemListEndpointParameters>()
  .keys({
    organizationId: validationSchemas.resourceId.required(),
    container: permissionValidationSchemas.permissionGroupContainer.required(),
    entity: permissionValidationSchemas.permissionItemEntity,
    target: permissionValidationSchemas.permissionItemTarget,
    action: permissionValidationSchemas.permissionItemAction,
    allow: Joi.boolean(),
  })
  .required();
