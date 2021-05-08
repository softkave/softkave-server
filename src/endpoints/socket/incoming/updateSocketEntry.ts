import Joi from "joi";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoints } from "../../types";
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
    const validatedData = validate(data.data, validationSchema);
    const user = await ctx.session.getUser(ctx, data, true, JWTEndpoints.Login);

    ctx.socket.updateSocketEntry(
        ctx,
        user.customId,
        data.clientId,
        validatedData
    );
};

export default updateSocketEntry;
