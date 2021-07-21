import { getDateString, indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import {
    IOutgoingMarkNotificationsReadPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { MarkRequestsReadEndpoint } from "./types";
import { markNotificationsReadJoiSchema } from "./validation";

const markRequestsRead: MarkRequestsReadEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, markNotificationsReadJoiSchema);
    const user = await context.session.getUser(context, instData);
    const requests = await context.notification.getUserNotificationsById(
        context,
        data.requestIds,
        user.customId
    );

    const processedNotifications = requests.map((item) => {
        return {
            customId: item.customId,
            readAt: getDateString(),
        };
    });

    await context.notification.markUserNotificationsRead(
        context,
        user.customId,
        processedNotifications
    );

    const userRoomName = context.room.getUserRoomName(user.customId);
    const updatePacket: IOutgoingMarkNotificationsReadPacket = {
        notifications: processedNotifications,
    };

    context.room.broadcast(
        context,
        instData,
        userRoomName,
        OutgoingSocketEvents.MarkNotificationsRead,
        updatePacket
    );
};

export default markRequestsRead;
