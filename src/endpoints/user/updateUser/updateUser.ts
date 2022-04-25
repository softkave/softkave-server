import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { clientToClientUserView } from "../../client/utils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import outgoingEventFn from "../../socket/outgoingEventFn";
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
    const incomingData = data.data;

    if (
        incomingData.email &&
        incomingData.email.toLowerCase() !== user.email.toLowerCase()
    ) {
        const userExists = await context.user.userExists(
            context,
            incomingData.email
        );

        if (userExists) {
            throw new EmailAddressNotAvailableError({ field: "email" });
        }
    }

    if (incomingData.notificationsLastCheckedAt) {
        const broadcastData: IOutgoingUserUpdatePacket = {
            notificationsLastCheckedAt: getDateString(
                incomingData.notificationsLastCheckedAt
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
        incomingData
    );

    instData.user = updatedUser;
    const tokenData = await context.session.getTokenData(context, instData);
    const client = await context.session.getClient(context, instData);
    const token = context.token.encodeToken(context, tokenData.customId);
    const userData = getPublicUserData(updatedUser);
    outgoingEventFn(
        context,
        SocketRoomNameHelpers.getUserRoomName(user.customId),
        {
            actionType: SystemActionType.Update,
            resourceType: SystemResourceType.User,
            resource: userData,
        }
    );

    return {
        token,
        client: clientToClientUserView(client, user.customId),
        user: getPublicUserData(updatedUser),
    };
};

export default updateUser;
