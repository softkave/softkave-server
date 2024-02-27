import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const getPermissionGroupAssigneesJoiSchema = Joi.object()
  .keys({
    organizationId: validationSchemas.resourceId.required(),
    permissionGroupId: validationSchemas.resourceId.required(),
  })
  .required();
