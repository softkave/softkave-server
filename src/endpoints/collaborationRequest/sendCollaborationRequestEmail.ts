import {
  collaborationRequestEmailHTML,
  collaborationRequestEmailText,
  collaborationRequestEmailTitle,
  ICollaborationRequestEmailProps,
} from "../../html/collaborationRequest";
import { IBaseContext } from "../contexts/IBaseContext";
import sendEmail from "../sendEmail";

export interface ISendCollaborationRequestEmailProps
  extends ICollaborationRequestEmailProps {
  email: string;
}

async function sendCollaborationRequestsEmail(
  ctx: IBaseContext,
  props: ISendCollaborationRequestEmailProps
) {
  const htmlContent = collaborationRequestEmailHTML(props);
  const textContent = collaborationRequestEmailText(props);
  return await sendEmail(ctx, {
    htmlContent,
    textContent,
    emailAddresses: [props.email],
    title: collaborationRequestEmailTitle(props.workspaceName),
  });
}

export default sendCollaborationRequestsEmail;
