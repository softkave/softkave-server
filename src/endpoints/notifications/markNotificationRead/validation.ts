import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const updateCollaborationRequestSchema = Joi.object().keys({
    notificationId: validationSchemas.uuid,
    readAt: Joi.number(),
});
