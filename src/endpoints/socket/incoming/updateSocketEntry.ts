import Joi from "joi";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoint } from "../../types";
import { fireAndForgetPromise } from "../../utils";
import { SocketEventHandler } from "../types";

const validationSchema = Joi.object()
    .keys({
        isActive: Joi.bool(),
    })
    .required();

interface IUpdateSocketEntryData {
    isActive?: boolean;
}

const updateSocketEntry: SocketEventHandler<IUpdateSocketEntryData> = async (
    ctx,
    data,
    fn
) => {
    const incomingData = validate(data.data, validationSchema);
    const user = await ctx.session.getUser(ctx, data, JWTEndpoint.Login);
    const socket = ctx.session.assertGetSocket(data);
    ctx.socketMap.updateSocketDetails(socket.id, {
        isActive: incomingData.isActive,
    });

    if (incomingData.isActive) {
        fireAndForgetPromise(ctx.unseenChats.removeEntry(ctx, user.customId));
    }
};

export default updateSocketEntry;
