import {
    collaborationRequestRevokedEmailHTML,
    collaborationRequestRevokedEmailText,
    ICollaborationRequestRevokedEmailProps,
} from "../../html/collaborationRequestRevokedEmail";
import { IBaseContext } from "../contexts/BaseContext";
import sendEmail from "../sendEmail";

export interface ISendCollaborationRequestRevokedEmailProps
    extends ICollaborationRequestRevokedEmailProps {
    email: string;
}

async function sendCollaborationRequestRevokedEmail(
    ctx: IBaseContext,
    props: ISendCollaborationRequestRevokedEmailProps
) {
    const htmlContent = collaborationRequestRevokedEmailHTML(props);
    const textContent = collaborationRequestRevokedEmailText(props);

    return await sendEmail(ctx, {
        htmlContent,
        textContent,
        emailAddresses: [props.email],
        title: props.title,
    });
}

export default sendCollaborationRequestRevokedEmail;
