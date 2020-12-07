import { IBlock } from "../../../mongo/block";
import { INotification, NotificationType } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

export function getOrgDeletedNotification(
    org: IBlock,
    deletedBy: IUser,
    user: IUser
) {
    const title = `${org.name} deleted`;
    const type = NotificationType.OrgDeleted;
    let body: string = "";

    if (deletedBy.customId === user.customId) {
        body =
            // `Hi ${user.name}`, +
            `This is to notify you that ${org.name} has been deleted and a notification has been sent to all the collaborators in the organization.`;
    } else {
        body =
            // `Hi ${user.name}`, +
            `This is to notify you that ${org.name} has been deleted by ${deletedBy.name}.`;
    }

    const notification: INotification = {
        title,
        body,
        type,
        customId: getNewId(),
        recipientId: user.customId,
        createdAt: getDate(),
    };

    return notification;
}
