import { IBlock } from "../../../mongo/block";
import RequestData from "../../RequestData";
import diffAssignedUsers from "./diffAssignedUsers";
import { IUpdateTaskContext, IUpdateTaskParameters } from "./types";

async function sendNewlyAssignedTaskEmail(
    context: IUpdateTaskContext,
    instData: RequestData<IUpdateTaskParameters>,
    task: IBlock,
    update: Partial<IBlock>,
    updatedTask: IBlock
) {
    // TODO: should we send an email if you're the one who assigned it to yourself?
    // TODO: how should we respect the user and not spam them? -- user settings

    const diff = diffAssignedUsers(task, update);
    const newAssignees = diff.newAssignees;

    if (newAssignees.length === 0) {
        return;
    }

    // const notifications: INotification[] = [];

    // TODO: what should we do if any of the above calls fail?

    // diff.newAssignees.forEach((assignedUser) => {
    //     const notification = getTaskAssignedNotification(
    //         task,
    //         assignedUser.userId
    //     );

    //     notifications.push(notification);
    // });

    // fireAndForganizationetPromise(
    //     context.notification.bulkSaveNotifications(context, notifications)
    // );
}

export default sendNewlyAssignedTaskEmail;