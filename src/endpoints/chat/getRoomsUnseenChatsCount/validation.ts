import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { chatConstants } from "../constants";

export const getRoomsUnseenChatsCountJoiSchema = Joi.object()
  .keys({
    orgId: validationSchemas.uuid.required(),
    roomIds: Joi.array()
      .items(validationSchemas.uuid)
      .max(chatConstants.maxRooms)
      .required(),
  })
  .required();