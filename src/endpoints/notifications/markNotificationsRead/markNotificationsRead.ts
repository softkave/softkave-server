import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { MarkNotificationReadEndpoint } from "./types";
import { markNotificationsReadJoiSchema } from "./validation";

const markNotificationsRead: MarkNotificationReadEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, markNotificationsReadJoiSchema);
    const user = await context.session.getUser(context, instData);
    const processedNotifications = data.notifications.map((n) => {
        return {
            customId: n.customId,
            readAt: n.readAt
                ? n.readAt > Date.now()
                    ? getDateString()
                    : n.readAt
                : getDateString(),
        };
    });

    await context.notification.markUserNotificationsRead(
        context,
        user.customId,
        processedNotifications
    );

    return { notifications: processedNotifications };
};

export default markNotificationsRead;
