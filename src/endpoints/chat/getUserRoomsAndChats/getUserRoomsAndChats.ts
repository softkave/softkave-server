import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getPublicChatsArray, getPublicRoomsArray } from "../utils";
import { GetUserRoomsAndChatsEndpoint } from "./type";

const getUserRoomsAndChats: GetUserRoomsAndChatsEndpoint = async (
    context,
    instaData
) => {
    const user = await context.session.getUser(context, instaData);

    context.socket.assertSocket(instaData);

    // const permissions = await context.accessControl.queryPermissions(
    //     context,
    //     user.organizations.map((o) => {
    //         return {
    //             organizationId: o.customId,
    //             resourceType: SystemResourceType.Chat,
    //             action: SystemActionType.Read,
    //             permissionResourceId: o.customId,
    //         };
    //     }),
    //     user
    // );

    const rooms = await context.chat.getRooms(
        context,
        user.customId,
        // permissions.map((p) => p.organizationId)
        user.orgs.map((organization) => organization.customId)
    );

    const chats = await context.chat.getMessages(
        context,
        rooms.map((rm) => rm.customId)
    );

    const publicRoomsData = getPublicRoomsArray(rooms);
    const publicChatsData = getPublicChatsArray(chats);

    return {
        rooms: publicRoomsData,
        chats: publicChatsData,
    };
};

export default getUserRoomsAndChats;
