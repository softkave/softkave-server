import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import chatValidationSchemas from "../validations";

export const sendMessageJoiSchema = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
    message: chatValidationSchemas.message.required(),
    roomId: validationSchemas.uuid.when("recipientId", {
        is: Joi.equal([null, undefined]),
        then: Joi.required(),
    }),
    recipientId: validationSchemas.uuid.when("roomId", {
        is: Joi.equal([null, undefined]),
        then: Joi.required(),
    }),
});
