import {
  collaborationRequestRevokedEmailHTML,
  collaborationRequestRevokedEmailText,
  collaborationRequestRevokedEmailTitle,
  ICollaborationRequestRevokedEmailProps,
} from "../../html/collaborationRequestRevoked";
import { IBaseContext } from "../contexts/IBaseContext";
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
  return sendEmail(ctx, {
    htmlContent,
    textContent,
    emailAddresses: [props.email],
    title: collaborationRequestRevokedEmailTitle(props.workspaceName),
  });
}

export default sendCollaborationRequestRevokedEmail;
