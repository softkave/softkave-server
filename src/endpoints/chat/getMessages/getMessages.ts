import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { GetMessagesEndpoint } from "./type";
import { getMessagesJoiSchema } from "./validation";

const getMessages: GetMessagesEndpoint = async (context, instaData) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);
    const data = validate(instaData.data, getMessagesJoiSchema);
    const org = await context.block.getBlockById(context, data.orgId);

    canReadBlock({ user, block: org });

    const messages = await context.chat.getMessages(
        context,
        data.orgId,
        data.roomIds
    );

    return messages;
};

export default getMessages;
