import { validate } from "../../../utilities/joiUtils";
import chatValidationSchemas from "../validations";
import { GroupListEndpoint } from "./types";

const getChatList: GroupListEndpoint = async (context, instData) => {
    const data = validate(instData.data, chatValidationSchemas.groupList);
    // await context.session.assertUser(context, instData);
    context.socket.assertSocket(instData);

    return await context.chat.getGroupList(context, data);
};

export default getChatList;
