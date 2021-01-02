import { getDateString, indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import {
    IOutgoingMarkNotificationsReadPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { MarkNotificationReadEndpoint } from "./types";
import { markNotificationsReadJoiSchema } from "./validation";

const markNotificationsRead: MarkNotificationReadEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, markNotificationsReadJoiSchema);
    const user = await context.session.getUser(context, instData);

    const notifications = await context.notification.getUserNotificationsById(
        context,
        data.notifications.map((n) => n.customId),
        user.customId
    );

    const inputMap = indexArray(data.notifications, { path: "customId" });
    const processedNotifications = notifications.map((n) => {
        const inputReadAt = inputMap[n.customId].readAt;
        return {
            customId: n.customId,
            readAt: inputReadAt
                ? inputReadAt > Date.now()
                    ? getDateString()
                    : getDateString(inputReadAt)
                : getDateString(),
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
        userRoomName,
        OutgoingSocketEvents.MarkNotificationsRead,
        updatePacket,
        instData
    );

    return { notifications: processedNotifications };
};

export default markNotificationsRead;