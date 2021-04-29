import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const updateClientJoiSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    data: Joi.object().keys({
        hasNotificationsAPI: Joi.boolean().optional(),
        grantedNotificationsPermission: Joi.boolean().optional(),
    }),
});
