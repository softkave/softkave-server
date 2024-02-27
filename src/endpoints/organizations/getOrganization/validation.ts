import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const getOrganizationJoiSchema = Joi.object()
  .keys({
    organizationId: validationSchemas.resourceId.required(),
  })
  .required();
