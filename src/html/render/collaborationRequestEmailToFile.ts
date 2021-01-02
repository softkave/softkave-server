import fs from "fs";
import moment from "moment";
import appInfo from "../../resources/appInfo";
import {
    collaborationRequestEmailHTML,
    collaborationRequestEmailText,
    ICollaborationRequestEmailProps,
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
        loginLink: `${appInfo.clientDomain}/login`,
        recipientIsUser: true,
        senderName: "Abayomi Isaac",
        senderOrg: "Softkave",
        signupLink: `${appInfo.clientDomain}/signup`,
        title: "Collaboration request from Yomi",
    };

    const newUserProps: ICollaborationRequestEmailProps = {
        loginLink: `${appInfo.clientDomain}/login`,
        senderName: "Abayomi Isaac",
        senderOrg: "Softkave",
        signupLink: `${appInfo.clientDomain}/signup`,
        recipientIsUser: false,
        title: "Collaboration request from Isaac",
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
