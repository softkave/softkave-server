import { validate } from "../../../utilities/joiUtils";
import chatValidationSchemas from "../validations";
import { PrivateChatListEndpoint } from "./types";

const getPrivateChatList: PrivateChatListEndpoint = async (context, instData) => {
    const data = validate(instData.data, chatValidationSchemas.privateChatList);
    // await context.session.assertUser(context, instData);
    context.socket.assertSocket(instData);

    return await context.chat.getPrivateChatList(context, data);
};

export default getPrivateChatList;
