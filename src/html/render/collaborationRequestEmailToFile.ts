import fs from "fs";
import moment from "moment";
import appInfo from "../../res/appInfo";
import {
  collaborationRequestEmailHTML,
  collaborationRequestEmailText,
  ICollaborationRequestEmailProps
} from "../collaborationRequestEmail";

const existingUserHTMLTemplateFile =
  "email-templates/templates/collaboration-request-existing-user-html.html";
const newUserHTMLTemplateFile =
  "email-templates/templates/collaboration-request-new-user-html.html";
const existingIsUserTextTemplateFile =
  "email-templates/templates/collaboration-request-existing-user-text.txt";
const newUserTextTemplateFile =
  "email-templates/templates/collaboration-request-new-user-text.txt";

export default function renderCollaborationRequestEmailToFile() {
  const existingUserProps: ICollaborationRequestEmailProps = {
    expiration: moment().add(1, "month"),
    loginLink: `${appInfo.clientDomain}/login`,
    message:
      "How are you Isaac, we had a talk yesterday, this is our official offer.",
    recipientIsUser: true,
    senderName: "Abayomi Isaac",
    senderOrg: "Softkave",
    signupLink: `${appInfo.clientDomain}/signup`
  };

  const newUserProps: ICollaborationRequestEmailProps = {
    expiration: moment().add(1, "month"),
    loginLink: `${appInfo.clientDomain}/login`,
    message:
      "How are you Isaac, we had a talk yesterday, this is our official offer.",
    senderName: "Abayomi Isaac",
    senderOrg: "Softkave",
    signupLink: `${appInfo.clientDomain}/signup`,
    recipientIsUser: false
  };

  const existingUserHTML = collaborationRequestEmailHTML(existingUserProps);
  const existingUserText = collaborationRequestEmailText(existingUserProps);
  const newUserHTML = collaborationRequestEmailHTML(newUserProps);
  const newUserText = collaborationRequestEmailText(newUserProps);

  fs.writeFileSync(existingUserHTMLTemplateFile, existingUserHTML);
  fs.writeFileSync(existingIsUserTextTemplateFile, existingUserText);
  fs.writeFileSync(newUserHTMLTemplateFile, newUserHTML);
  fs.writeFileSync(newUserTextTemplateFile, newUserText);
}
