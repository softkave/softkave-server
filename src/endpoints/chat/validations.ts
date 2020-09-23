import Joi, { string } from "joi";
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

const insertMessage = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    orgId: validationSchemas.uuid.required(),
    message: Joi.string().required(),
    sender: validationSchemas.uuid.required(),
    recipient: validationSchemas.uuid.required(),
});
const chatValidationSchemas = {
    privateMessages,
    groupMessages,
    privateChatList,
    groupList,
    insertMessage
};

export default chatValidationSchemas;
