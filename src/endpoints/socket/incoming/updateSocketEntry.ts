import Joi from "joi";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoints } from "../../types";
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
    const validatedData = validate(data.data, validationSchema);

    await ctx.session.assertUser(ctx, data, JWTEndpoints.Login);
    ctx.socket.assertSocket(data);
    ctx.socket.updateSocketEntry(ctx, data.socket.id, validatedData);
};

export default updateSocketEntry;
