import { GetUserRoomsAndChatsEndpoint } from "./type";

const getRooms: GetUserRoomsAndChatsEndpoint = async (context, instaData) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);

    const rooms = await context.chat.getRooms(context, user.customId);
    const chats = await context.chat.getMessages(
        context,
        rooms.map((rm) => rm.customId)
    );

    return { rooms, chats };
};

export default getRooms;
