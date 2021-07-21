import Joi from "joi";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoint } from "../../types";
import { fireAndForganizationetPromise } from "../../utils";
import { SocketEventHandler } from "../types";

const validationSchema = Joi.object()
    .keys({
        isInactive: Joi.bool(),
    })
    .required();

interface IUpdateSocketEntryData {
    isInactive?: boolean;
}

const updateSocketEntry: SocketEventHandler<IUpdateSocketEntryData> = async (
    ctx,
    data,
    fn
) => {
    const incomingData = validate(data.data, validationSchema);
    const user = await ctx.session.getUser(ctx, data, JWTEndpoint.Login);
    ctx.socket.assertSocket(data);
    ctx.socket.updateSocketEntry(ctx, data.socket.id, incomingData);

    if (!incomingData.isInactive) {
        fireAndForganizationetPromise(
            ctx.unseenChats.removeEntry(ctx, user.customId)
        );
    }
};

export default updateSocketEntry;
