import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const addRoomJoiSchema = Joi.object()
  .keys({
    recipientId: validationSchemas.uuid.required(),
    orgId: validationSchemas.uuid.required(),
  })
  .required();
