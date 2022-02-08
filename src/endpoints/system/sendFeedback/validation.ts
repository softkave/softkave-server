import Joi from "joi";
import taskValidationSchemas from "../../task/validation";
import userValidationSchemas from "../../user/validation";

export const sendFeedbackJoiSchema = Joi.object().keys({
    feedback: taskValidationSchemas.name.lowercase().required(),
    description: taskValidationSchemas.description,
    notifyEmail: userValidationSchemas.email.allow(null),
});
