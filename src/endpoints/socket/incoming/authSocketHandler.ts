import { JWTEndpoints } from "../../types";
import { SocketEventHandler } from "../types";

const authSocketHandler: SocketEventHandler = async (ctx, data, fn) => {
    try {
        const user = await ctx.session.validateUserTokenData(
            ctx,
            data.tokenData,
            true,
            JWTEndpoints.Login
        );

        const userRoomName = ctx.room.getUserRoomName(user.customId);

        ctx.socket.mapUserToSocketId(data, user);
        ctx.room.subscribe(data, userRoomName);
    } catch (error) {
        data.socket.disconnect();
        throw error;
    }
};

export default authSocketHandler;
