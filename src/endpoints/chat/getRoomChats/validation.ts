import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getRoomChatsJoiSchema = Joi.object()
  .keys({
    roomId: validationSchemas.uuid.required(),
  })
  .required();
