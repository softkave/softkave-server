import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { IUserUpdatePacket, OutgoingSocketEvents } from "../../socket/server";
import { UpdateUserEndpoint } from "./types";
import { updateUserJoiSchema } from "./validation";

const updateUser: UpdateUserEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateUserJoiSchema);
    const user = await context.session.getUser(context, instData);

    if (data.notificationsLastCheckedAt) {
        const broadcastData: IUserUpdatePacket = {
            notificationsLastCheckedAt: getDateString(
                data.notificationsLastCheckedAt
            ),
        };

        const userRoomName = context.room.getUserRoomName(user.customId);
        context.room.broadcast(
            context,
            userRoomName,
            OutgoingSocketEvents.UserUpdate,
            broadcastData,
            instData
        );
    }

    await context.session.updateUser(context, instData, data);
};

export default updateUser;
