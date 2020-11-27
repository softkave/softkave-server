import { getPublicChatsArray, getPublicRoomsArray } from "../utils";
import { GetUserRoomsAndChatsEndpoint } from "./type";

const getUserRoomsAndChats: GetUserRoomsAndChatsEndpoint = async (
    context,
    instaData
) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);

    const rooms = await context.chat.getRooms(context, user.customId);
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
