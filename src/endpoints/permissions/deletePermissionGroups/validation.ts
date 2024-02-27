import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {IDeletePermissionGroupsEndpointParameters} from './types';

export const deletePermissionGroupsJoiSchema =
  Joi.object<IDeletePermissionGroupsEndpointParameters>()
    .keys({
      workspaceId: validationSchemas.resourceId.required(),
      permissionGroupIds: validationSchemas.resourceIdList.required(),
    })
    .required();
