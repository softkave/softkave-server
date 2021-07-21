import {
    collaborationRequestRevokedEmailHTML,
    collaborationRequestRevokedEmailText,
    ICollaborationRequestRevokedEmailProps,
} from "../../html/collaborationRequestRevokedEmail";
import sendEmail from "../sendEmail";

export interface ISendCollaborationRequestRevokedEmailProps
    extends ICollaborationRequestRevokedEmailProps {
    email: string;
}

async function sendCollaborationRequestRevokedEmail(
    props: ISendCollaborationRequestRevokedEmailProps
) {
    const htmlContent = collaborationRequestRevokedEmailHTML(props);
    const textContent = collaborationRequestRevokedEmailText(props);

    return sendEmail({
        htmlContent,
        textContent,
        emailAddresses: [props.email],
        title: props.title,
    });
}

export default sendCollaborationRequestRevokedEmail;
