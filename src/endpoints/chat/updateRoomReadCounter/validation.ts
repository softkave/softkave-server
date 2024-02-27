import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const updateRoomReadCounterJoiSchema = Joi.object().keys({
  orgId: validationSchemas.resourceId.required(),
  roomId: validationSchemas.resourceId.required(),
  readCounter: Joi.date(),
});
