import {
  IAssignedTaskEmailNotificationProps,
  assignedTaskEmailNotificationHTML,
  assignedTaskEmailNotificationText,
} from "../assignedTaskEmailNotification";
import appInfo from "../../res/appInfo";
import fs from "fs";

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
  };

  const existingUserHTML = assignedTaskEmailNotificationHTML(props);
  const existingUserText = assignedTaskEmailNotificationText(props);

  fs.writeFileSync(assignedTaskNotificationHTMLTemplateFile, existingUserHTML);
  fs.writeFileSync(assignedTaskNotificationTextTemplateFile, existingUserText);
}
