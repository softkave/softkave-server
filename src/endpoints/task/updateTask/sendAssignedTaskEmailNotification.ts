import {
    assignedTaskEmailNotificationHTML,
    assignedTaskEmailNotificationText,
    assignedTaskEmailNotificationTitle,
    IAssignedTaskEmailNotificationProps,
} from "../../../html/assignedTaskEmailNotification";
import { IBaseContext } from "../../contexts/IBaseContext";
import sendEmail from "../../sendEmail";

export interface ISendAssignedTaskEmailNotificationProps
    extends IAssignedTaskEmailNotificationProps {
    email: string;
}

async function sendAssignedTaskEmailNotification(
    ctx: IBaseContext,
    props: ISendAssignedTaskEmailNotificationProps
) {
    const htmlContent = assignedTaskEmailNotificationHTML(props);
    const textContent = assignedTaskEmailNotificationText(props);

    return await sendEmail(ctx, {
        htmlContent,
        textContent,
        emailAddresses: [props.email],
        title: assignedTaskEmailNotificationTitle,
    });
}

export default sendAssignedTaskEmailNotification;
