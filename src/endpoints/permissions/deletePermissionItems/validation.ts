import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {permissionValidationSchemas} from '../validation';
import {IDeletePermissionItemInput, IDeletePermissionItemsEndpointParameters} from './types';

const permissionItemInput = Joi.object<IDeletePermissionItemInput>({
  entity: permissionValidationSchemas.permissionItemEntity.required(),
  target: permissionValidationSchemas.permissionItemTarget.required(),
  action: permissionValidationSchemas.permissionItemAction.required(),
  allow: Joi.boolean().required(),
});
export const deletePermissionItemsJoiSchema = Joi.object<IDeletePermissionItemsEndpointParameters>()
  .keys({
    organizationId: validationSchemas.resourceId.required(),
    items: Joi.array().items(permissionItemInput).max(100).required(),
  })
  .required();
