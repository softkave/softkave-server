import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const updateClientJoiSchema = Joi.object()
    .keys({
        customId: validationSchemas.uuid.required(),
        data: Joi.object()
            .keys({
                hasUserSeenNotificationsPermissionDialog: Joi.bool(),
                muteChatNotifications: Joi.bool(),
                isSubcribedToPushNotifications: Joi.bool(),
            })
            .required(),
    })
    .required();
