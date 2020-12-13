import { SystemResourceType } from "../../../models/system";
import { IBlock } from "../../../mongo/block";
import { INotification, NotificationType } from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

export function getTaskAssignedNotification(task: IBlock, assigneeId: string) {
    const title = `Assigned Task Notification`;
    const type = NotificationType.TaskUpdated;
    const body = ``;
    const notification: INotification = {
        title,
        body,
        type,
        customId: getNewId(),
        recipientId: assigneeId,
        orgId: task.rootBlockId,
        createdAt: getDate(),
        attachments: [
            {
                resourceId: task.customId,
                resourceType: SystemResourceType.Task,
            },
        ],
    };

    return notification;
}
