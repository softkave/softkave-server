import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const getOrganizationUnseenChatsCountJoiSchema = Joi.object()
  .keys({
    orgId: validationSchemas.resourceId.required(),
  })
  .required();
