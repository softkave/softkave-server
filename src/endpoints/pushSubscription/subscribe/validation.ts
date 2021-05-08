import Joi from "joi";

export const subscribePushSubscriptionJoiSchema = Joi.object()
    .keys({
        endpoint: Joi.string().required(),
        keys: {
            p256dh: Joi.string().required(),
            auth: Joi.string().required(),
        },
    })
    .required();
