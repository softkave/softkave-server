import {
  emailTemplateStyles,
  getCenteredContentHTML,
  getFooterHTML,
  getHeaderHTML,
  getHeaderText,
  getLoginSectionHTML,
  getLoginSectionText,
} from "./helpers";
import { IBaseEmailTemplateProps } from "./types";

export interface ICollaborationRequestRevokedEmailProps
  extends IBaseEmailTemplateProps {
  workspaceName: string;
}

export function collaborationRequestRevokedEmailTitle(workspaceName: string) {
  return `Collaboration Request from ${workspaceName} Revoked`;
}

export function collaborationRequestRevokedEmailHTML(
  props: ICollaborationRequestRevokedEmailProps
) {
  const title = collaborationRequestRevokedEmailTitle(props.workspaceName);
  return `
  <!DOCTYPE html>
  <html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>${getHeaderText(title)}</title>
    ${emailTemplateStyles}
  </head>
  <body>
    ${getHeaderHTML(title)}
    ${getCenteredContentHTML(`
    <p>
      This is to notify you that the collaboration request sent from <b>
      ${props.workspaceName}</b> has been revoked.
    </p>
    `)}
    ${getLoginSectionHTML(props)}
    ${getFooterHTML()}
  </body>
  </html>
  `;
}

export function collaborationRequestRevokedEmailText(
  props: ICollaborationRequestRevokedEmailProps
) {
  const title = collaborationRequestRevokedEmailTitle(props.workspaceName);
  const txt = `
  ${getHeaderText(title)}
  -
  This is to notify you that the collaboration request sent from ${
    props.workspaceName
  } has been revoked.
  ${getLoginSectionText(props)}
  `;

  return txt;
}
