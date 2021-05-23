import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { clientToClientUserView } from "../../client/utils";
import RequestData from "../../RequestData";
import {
    IOutgoingUserUpdatePacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { EmailAddressNotAvailableError } from "../errors";
import { getPublicUserData } from "../utils";
import { UpdateUserEndpoint } from "./types";
import { updateUserJoiSchema } from "./validation";

const updateUser: UpdateUserEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateUserJoiSchema);
    const user = await context.session.getUser(context, instData);

    if (data.email) {
        const userExists = await context.user.userExists(context, data.email);

        if (userExists) {
            throw new EmailAddressNotAvailableError({ field: "email" });
        }
    }

    if (data.notificationsLastCheckedAt) {
        const broadcastData: IOutgoingUserUpdatePacket = {
            notificationsLastCheckedAt: getDateString(
                data.notificationsLastCheckedAt
            ),
        };

        const userRoomName = context.room.getUserRoomName(user.customId);
        context.room.broadcast(
            context,
            instData,
            userRoomName,
            OutgoingSocketEvents.UserUpdate,
            broadcastData,
            true
        );
    }

    const updatedUser = await context.user.updateUserById(
        context,
        user.customId,
        data
    );

    instData.user = updatedUser;

    if (data.password) {
        return await context.changePassword(
            context,
            new RequestData({
                ...instData,
                data: { password: data.password },
            })
        );
    }

    const tokenData = await context.session.getTokenData(context, instData);
    const client = await context.session.getClient(context, instData);
    const token = context.token.encodeToken(context, tokenData.customId);

    return {
        token,
        client: clientToClientUserView(client, user.customId),
        user: getPublicUserData(updatedUser),
    };
};

export default updateUser;
