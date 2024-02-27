import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const removeCollaboratorJoiSchema = Joi.object()
  .keys({
    organizationId: validationSchemas.resourceId.required(),
    collaboratorId: validationSchemas.resourceId.required(),
  })
  .required();
