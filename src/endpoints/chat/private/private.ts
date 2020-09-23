import { validate } from "../../../utilities/joiUtils";
import { IBaseContext } from "../../contexts/BaseContext";
import chatValidationSchemas from "../validations";
import { getPrivateMessageEndpoint } from "./type";

const getPrivateMessage: getPrivateMessageEndpoint = async (
    context,
    instaData
) => {
    const data = validate(
        instaData.data,
        chatValidationSchemas.privateMessages
    );

    const messages = await context.chat.getPrivateMessage(context, data);

    return messages;
};

const insertPrivateMessage = async (context: IBaseContext, instaData) => {
    const data = validate(instaData.data, chatValidationSchemas.insertMessage);

    const message = await context.chat.insertPrivateMessage(context, data);

    return message;
};

export { getPrivateMessage, insertPrivateMessage };
