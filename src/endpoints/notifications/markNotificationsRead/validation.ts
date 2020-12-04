import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { notificationConstants } from "../constants";

export const markNotificationsReadJoiSchema = Joi.object().keys({
    notifications: Joi.array()
        .items(
            Joi.object().keys({
                customId: validationSchemas.uuid.required(),
                readAt: Joi.number(),
            })
        )
        .max(notificationConstants.maxMarkNotificationsReadNum)
        .required(),
});
