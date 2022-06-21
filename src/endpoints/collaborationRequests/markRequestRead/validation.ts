import Joi from "joi";

export const markRequestReadJoiSchema = Joi.object()
    .keys({
        requestId: Joi.string().uuid().required(),
    })
    .required();
