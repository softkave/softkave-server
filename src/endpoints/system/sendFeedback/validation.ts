import Joi from "joi";
import blockValidationSchemas from "../../block/validation";

export const sendFeedbackJoiSchema = Joi.object().keys({
    title: blockValidationSchemas.lowerCasedName,
    message: blockValidationSchemas.updateDescription,
});
