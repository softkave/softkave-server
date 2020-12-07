import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { notificationConstants } from "../constants";
import notificationsValidationSchemas from "../validation";

const subscription = Joi.object().keys({
    customId: validationSchemas.uuid.required(),

    recipients: Joi.array().items(
        Joi.object().keys({
            userId: validationSchemas.uuid.required(),
            reason: notificationsValidationSchemas.notificationReason.required(),
        })
    ),
});

export const updateResourceSubscriptionsJoiSchema = Joi.object().keys({
    resourceId: validationSchemas.uuid.required(),
    resourceType: notificationsValidationSchemas.subscriptionResourceType.required(),
    subscriptions: Joi.array()
        .items(subscription)
        .unique("customId")
        // TODO: calculate max notification types
        .max(notificationConstants.maxUpdateResourceSubscriptionsNum)
        .required(),
});
