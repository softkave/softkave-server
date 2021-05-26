import { JWTEndpoint } from "../../types";
import { SocketEventHandler } from "../types";

const authSocketHandler: SocketEventHandler = async (ctx, data, fn) => {
    try {
        const user = await ctx.session.getUser(ctx, data, JWTEndpoint.Login);
        const userRoomName = ctx.room.getUserRoomName(user.customId);
        await ctx.socket.insertSocketEntry(ctx, data);
        ctx.room.subscribe(data, userRoomName);
    } catch (error) {
        data.socket.disconnect();
        throw error;
    }
};

export default authSocketHandler;
