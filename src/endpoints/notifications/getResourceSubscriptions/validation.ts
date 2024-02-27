import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const getResourceSubscriptionsJoiSchema = Joi.object().keys({
  blockId: validationSchemas.resourceId.required(),
});
