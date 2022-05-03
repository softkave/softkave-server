import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import { JWTEndpoint } from "../../types";
import { SocketEventHandler } from "../types";

const authSocketHandler: SocketEventHandler = async (ctx, data, fn) => {
    try {
        const user = await ctx.session.getUser(ctx, data, JWTEndpoint.Login);
        const userRoomName = SocketRoomNameHelpers.getUserRoomName(
            user.customId
        );

        const socket = ctx.session.assertGetSocket(data);
        await ctx.socketMap.addSocket({
            socket,
            userId: user.customId,
        });

        ctx.socketRooms.addToRoom(userRoomName, socket.id);
    } catch (error) {
        data.socket.disconnect();
        throw error;
    }
};

export default authSocketHandler;
