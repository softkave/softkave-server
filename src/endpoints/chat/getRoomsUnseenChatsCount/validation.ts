import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {chatConstants} from '../constants';

export const getRoomsUnseenChatsCountJoiSchema = Joi.object()
  .keys({
    orgId: validationSchemas.resourceId.required(),
    roomIds: Joi.array().items(validationSchemas.resourceId).max(chatConstants.maxRooms).required(),
  })
  .required();
