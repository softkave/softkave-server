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

export interface ICollaboratorRemovedEmailProps
  extends IBaseEmailTemplateProps {
  organizationName: string;
}

export function collaboratorRemovedEmailTitle(workspaceName: string) {
  return `You've been removed from ${workspaceName}`;
}

export function collaboratorRemovedEmailHTML(
  props: ICollaboratorRemovedEmailProps
) {
  const title = collaboratorRemovedEmailTitle(props.organizationName);
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
    This is to notify you that you've been removed from <b>
    ${props.organizationName}</b> and your access has been revoked.
  </p>
  `)}
  ${getLoginSectionHTML(props)}
  ${getFooterHTML()}
</body>
</html>
`;
}

export function collaboratorRemovedEmailText(
  props: ICollaboratorRemovedEmailProps
) {
  const txt = `
${getHeaderText("Collaborator Removed")}
-
This is to notify you that you have been removed from ${
    props.organizationName
  } and your access has been revoked.
${getLoginSectionText(props)}
`;

  return txt;
}
