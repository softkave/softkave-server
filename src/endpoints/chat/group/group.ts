import { validate } from "../../../utilities/joiUtils";
import chatValidationSchemas from "../validations";
import { getGroupMessageEndpoint } from "./type";

const getGroupMessage: getGroupMessageEndpoint = async (context, instaData) => {
    const data = validate(instaData.data, chatValidationSchemas.groupMessages);

    const messages = await context.chat.getGroupMessage(context, data);

    return messages;
};

export default getGroupMessage;