import {
    collaborationRequestEmailHTML,
    collaborationRequestEmailText,
    ICollaborationRequestEmailProps,
} from "../../html/collaborationRequestEmail";
import sendEmail from "../sendEmail";

export interface ISendCollaborationRequestEmailProps
    extends ICollaborationRequestEmailProps {
    email: string;
}

async function sendCollaborationRequestsEmail(
    props: ISendCollaborationRequestEmailProps
) {
    const htmlContent = collaborationRequestEmailHTML(props);
    const textContent = collaborationRequestEmailText(props);

    return await sendEmail({
        htmlContent,
        textContent,
        emailAddresses: [props.email],
        title: props.title,
    });
}

export default sendCollaborationRequestsEmail;
