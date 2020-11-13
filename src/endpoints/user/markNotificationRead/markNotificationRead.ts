import { validate } from "../../../utilities/joiUtils";
import { PermissionDeniedError } from "../../errors";
import { NotificationDoesNotExistError } from "../../notifications/errors";
import { IOutgoingUpdateNotificationsPacket } from "../../socket/outgoingEventTypes";
import { MarkNotificationReadEndpoint } from "./types";
import { updateCollaborationRequestSchema } from "./validation";

const markNotificationRead: MarkNotificationReadEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, updateCollaborationRequestSchema);
    const user = await context.session.getUser(context, instData);
    const notification = await context.notification.getNotificationById(
        context,
        data.notificationId
    );

    if (!notification) {
        throw new NotificationDoesNotExistError();
    }

    if (notification.to.email !== user.email) {
        throw new PermissionDeniedError();
    }

    const update: IOutgoingUpdateNotificationsPacket = {
        notifications: [
            {
                customId: notification.customId,
                data: { readAt: data.readAt },
            },
        ],
    };

    await context.notification.updateNotificationById(
        context,
        data.notificationId,
        update
    );

    // const roomName = context.room.getUserPersonalRoomName(user);
    // context.room.broadcast(
    //   context,
    //   roomName,
    //   OutgoingSocketEvents.UpdateNotification,
    //   update,
    //   instData
    // );
};

export default markNotificationRead;
