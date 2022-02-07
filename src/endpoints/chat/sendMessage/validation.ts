import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import chatValidationSchemas from "../validations";

export const sendMessageJoiSchema = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
    message: chatValidationSchemas.message.required(),
    roomId: validationSchemas.uuid, // TODO: how can we check if recipientId is optional then make this required
    recipientId: validationSchemas.uuid, // TODOL same, but for roomId
});
