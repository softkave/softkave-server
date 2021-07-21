import {
    assignedTaskEmailNotificationHTML,
    assignedTaskEmailNotificationText,
    assignedTaskEmailNotificationTitle,
    IAssignedTaskEmailNotificationProps,
} from "../../../html/assignedTaskEmailNotification";
import sendEmail from "../../sendEmail";

export interface ISendAssignedTaskEmailNotificationProps
    extends IAssignedTaskEmailNotificationProps {
    email: string;
}

async function sendAssignedTaskEmailNotification(
    props: ISendAssignedTaskEmailNotificationProps
) {
    const htmlContent = assignedTaskEmailNotificationHTML(props);
    const textContent = assignedTaskEmailNotificationText(props);

    return await sendEmail({
        htmlContent,
        textContent,
        emailAddresses: [props.email],
        title: assignedTaskEmailNotificationTitle,
    });
}

export default sendAssignedTaskEmailNotification;
