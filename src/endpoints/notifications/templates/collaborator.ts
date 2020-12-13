import { IBlock } from "../../../mongo/block";
import { INotification, NotificationType } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

export function getCollaboratorRemovedNotification(
    org: IBlock,
    user: IUser,
    byUser: IUser // TODO: should we include the name of the remover
) {
    const title = ``;
    const type = NotificationType.CollaboratorRemoved;
    const body =
        // `Hi ${user.name}` +
        `This is to notify you that you have been removed from ${org.name} by ${byUser.name}.`;

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
