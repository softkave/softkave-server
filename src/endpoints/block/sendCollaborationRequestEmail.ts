import {
    collaborationRequestEmailHTML,
    collaborationRequestEmailText,
    ICollaborationRequestEmailProps,
} from "../../html/collaborationRequestEmail";
import { IBaseContext } from "../contexts/BaseContext";
import sendEmail from "../sendEmail";

export interface ISendCollaborationRequestEmailProps
    extends ICollaborationRequestEmailProps {
    email: string;
}

async function sendCollabReqEmail(
    ctx: IBaseContext,
    props: ISendCollaborationRequestEmailProps
) {
    const htmlContent = collaborationRequestEmailHTML(props);
    const textContent = collaborationRequestEmailText(props);

    return await sendEmail(ctx, {
        htmlContent,
        textContent,
        emailAddresses: [props.email],
        title: props.title,
    });
}

export default sendCollabReqEmail;
