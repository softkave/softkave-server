import Joi from "joi";
import { validationSchemas } from "../../utilities/validationUtils";

const privateMessages = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    recipientId: validationSchemas.uuid.required(),
    orgId: validationSchemas.uuid.required(),
});

const groupMessages = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    orgId: validationSchemas.uuid.required(),
});

const privateChatList = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    orgId: validationSchemas.uuid.required(),
});

const groupList = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
});
const chatValidationSchemas = {
    privateMessages,
    groupMessages,
    privateChatList,
    groupList,
};

export default chatValidationSchemas;
