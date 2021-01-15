import fs from "fs";
import moment from "moment";
import appInfo from "../resources/appInfo";
import { appVariables } from "../resources/appVariables";
import {
    IAssignedTaskEmailNotificationProps,
    assignedTaskEmailNotificationHTML,
    assignedTaskEmailNotificationText,
} from "./assignedTaskEmailNotification";
import {
    ICollaborationRequestEmailProps,
    collaborationRequestEmailHTML,
    collaborationRequestEmailText,
} from "./collaborationRequestEmail";
import {
    generateEmailConfirmationHTML,
    generateEmailConfirmationText,
    IGenerateEmailConfirmationMediaProps,
} from "./emailConfirmationEmail";
import {
    IForgotPasswordEmailProps,
    forgotPasswordEmailHTML,
    forgotPasswordEmailText,
} from "./forgotPasswordEmail";

throw new Error(
    "Set env varibles before running code, or run script or code with dotenv"
);

// Assigned task email
const assignedTaskNotificationHTMLTemplateFile =
    "email-templates/templates/assigned-task-notification-html.html";
const assignedTaskNotificationTextTemplateFile =
    "email-templates/templates/assigned-task-notification-text.txt";

export function renderAssignedTaskEmailToFile() {
    const props: IAssignedTaskEmailNotificationProps = {
        assignee: "Abayomi Akintomide",
        assigner: "Ajayi Solomon",
        board: "Softkave",
        loginLink: `${appInfo.clientDomain}/login`,
        taskName: "did you know the earth is flat? prove it's not!",
        taskDescription:
            "With all that the world could muster, all their strength and measure, the giant stood tall, unflinching. If not for God, if not for the Christians, ...",
    };

    const existingUserHTML = assignedTaskEmailNotificationHTML(props);
    const existingUserText = assignedTaskEmailNotificationText(props);

    fs.writeFileSync(
        assignedTaskNotificationHTMLTemplateFile,
        existingUserHTML
    );
    fs.writeFileSync(
        assignedTaskNotificationTextTemplateFile,
        existingUserText
    );
}

// Collaboration request email
const existingUserHTMLTemplateFile =
    "email-templates/templates/collaboration-request-existing-user-html.html";
const newUserHTMLTemplateFile =
    "email-templates/templates/collaboration-request-new-user-html.html";
const existingIsUserTextTemplateFile =
    "email-templates/templates/collaboration-request-existing-user-text.txt";
const newUserTextTemplateFile =
    "email-templates/templates/collaboration-request-new-user-text.txt";

export function renderCollaborationRequestEmailToFile() {
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

// Forgot password email
const forgotPasswordHTMLTemplateFile =
    "email-templates/templates/forgot-password-html.html";
const forgotPasswordTextTemplateFile =
    "email-templates/templates/forgot-password-text.txt";

export function renderForgotPasswordEmailToFile() {
    const props: IForgotPasswordEmailProps = {
        expiration: moment().add(2, "days"),
        link: `${appInfo.clientDomain}/change-password?t=12345`,
    };

    const existingUserHTML = forgotPasswordEmailHTML(props);
    const existingUserText = forgotPasswordEmailText(props);

    fs.writeFileSync(forgotPasswordHTMLTemplateFile, existingUserHTML);
    fs.writeFileSync(forgotPasswordTextTemplateFile, existingUserText);
}

// Confirm email address email
const comfirmEmailAddressHTMLFile =
    "email-templates/templates/forgot-password-html.html";
const confirmEmailAddressTxtFile =
    "email-templates/templates/forgot-password-text.txt";

export function renderConfirmEmailAddressMedia() {
    const props: IGenerateEmailConfirmationMediaProps = {
        link: `${appVariables.confirmEmailAddressPath}`,
        reminderCount: 1,
    };

    const existingUserHTML = generateEmailConfirmationHTML(props);
    const existingUserText = generateEmailConfirmationText(props);

    fs.writeFileSync(comfirmEmailAddressHTMLFile, existingUserHTML);
    fs.writeFileSync(confirmEmailAddressTxtFile, existingUserText);
}
