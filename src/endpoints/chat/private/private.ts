import { validate } from "../../../utilities/joiUtils";
import chatValidationSchemas from "../validations";
import { getPrivateMessageEndpoint } from "./type";

const getGroupMessage: getPrivateMessageEndpoint = async (context, instaData) => {
    const data = validate(instaData.data, chatValidationSchemas.privateMessages);

    const messages = await context.chat.getPrivateMessage(context, data);

    return messages;
};

export default getGroupMessage;
