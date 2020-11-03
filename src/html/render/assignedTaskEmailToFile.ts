import fs from "fs";
import appInfo from "../../res/appInfo";
import {
    assignedTaskEmailNotificationHTML,
    assignedTaskEmailNotificationText,
    IAssignedTaskEmailNotificationProps,
} from "../assignedTaskEmailNotification";

const assignedTaskNotificationHTMLTemplateFile =
    "email-templates/templates/assigned-task-notification-html.html";
const assignedTaskNotificationTextTemplateFile =
    "email-templates/templates/assigned-task-notification-text.txt";

export default function renderAssignedTaskEmailToFile() {
    const props: IAssignedTaskEmailNotificationProps = {
        assignee: "Abayomi Akintomide",
        assigner: "Ajayi Solomon",
        senderOrg: "Softkave",
        loginLink: `${appInfo.clientDomain}/login`,
        taskName: "did you know the earth is flat? prove it's not!",
        taskDescription:
            "With all that the world could muster, all their strength and measure, the giant stood tall, unflinching. If not for God, if not for the Christians, ...",
    };

    const existingUserHTML = assignedTaskEmailNotificationHTML(props);
    const existingUserText = assignedTaskEmailNotificationText(props);

    fs.writeFileSync(
        assignedTaskNotificationHTMLTemplateFile,
        existingUserHTML
    );
    fs.writeFileSync(
        assignedTaskNotificationTextTemplateFile,
        existingUserText
    );
}
