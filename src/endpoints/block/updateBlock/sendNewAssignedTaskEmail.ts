import { IBlock } from "../../../mongo/block";
import { INotification } from "../../../mongo/notification";
import { getTaskAssignedNotification } from "../../notifications/templates/task";
import RequestData from "../../RequestData";
import { fireAndForgetPromise } from "../../utils";
import diffAssignedUsers from "./diffAssignedUsers";
import { IUpdateBlockContext, IUpdateBlockParameters } from "./types";

async function sendNewlyAssignedTaskEmail(
    context: IUpdateBlockContext,
    instData: RequestData<IUpdateBlockParameters>,
    block: IBlock,
    data: Partial<IBlock>,
    task: IBlock
) {
    // TODO: should we send an email if you're the one who assigned it to yourself?
    // TODO: how should we respect the user and not spam them? -- user settings

    const diff = diffAssignedUsers(block, data);
    const newAssignees = diff.newAssignees;

    if (newAssignees.length === 0) {
        return;
    }

    const notifications: INotification[] = [];

    // TODO: what should we do if any of the above calls fail?

    diff.newAssignees.forEach((assignedUser) => {
        const notification = getTaskAssignedNotification(
            task,
            assignedUser.userId
        );

        notifications.push(notification);
    });

    fireAndForgetPromise(
        context.notification.bulkSaveNotifications(context, notifications)
    );
}

export default sendNewlyAssignedTaskEmail;
