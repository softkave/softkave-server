import Joi from "joi";
import blockValidationSchemas from "../../block/validation";
import userValidationSchema from "../../user/validation";

export const sendFeedbackJoiSchema = Joi.object().keys({
    feedback: blockValidationSchemas.name.lowercase().required(),
    description: blockValidationSchemas.description,
    notifyEmail: userValidationSchema.email.allow([null]),
});
