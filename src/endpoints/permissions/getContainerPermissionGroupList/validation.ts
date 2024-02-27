import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {endpointValidationSchemas} from '../../validation';
import {permissionValidationSchemas} from '../validation';
import {IGetContainerPermissionGroupListEndpointParameters} from './types';

export const getContainerPermissionGroupListJoiSchema =
  Joi.object<IGetContainerPermissionGroupListEndpointParameters>()
    .keys({
      workspaceId: validationSchemas.resourceId.required(),
      container: permissionValidationSchemas.permissionGroupContainer.required(),
      page: endpointValidationSchemas.page,
      pageSize: endpointValidationSchemas.pageSize,
    })
    .required();
