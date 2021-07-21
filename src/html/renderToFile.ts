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
    collaboratorRemovedEmailHTML,
    collaboratorRemovedEmailText,
    ICollaboratorRemovedEmailProps,
} from "./collaboratorRemoved";
import {
    generateEmailConfirmationHTML,
    generateEmailConfirmationText,
    IGenerateEmailConfirmationMediaProps,
} from "./emailConfirmationEmail";
import {
    IForganizationotPasswordEmailProps,
    forganizationotPasswordEmailHTML,
    forganizationotPasswordEmailText,
} from "./forganizationotPasswordEmail";

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
        senderOrganization: "Softkave",
        signupLink: `${appInfo.clientDomain}/signup`,
        title: "Collaboration request from Yomi",
    };

    const newUserProps: ICollaborationRequestEmailProps = {
        loginLink: `${appInfo.clientDomain}/login`,
        senderName: "Abayomi Isaac",
        senderOrganization: "Softkave",
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

// Forganizationot password email
const forganizationotPasswordHTMLTemplateFile =
    "email-templates/templates/forganizationot-password-html.html";
const forganizationotPasswordTextTemplateFile =
    "email-templates/templates/forganizationot-password-text.txt";

export function renderForganizationotPasswordEmailToFile() {
    const props: IForganizationotPasswordEmailProps = {
        expiration: moment().add(2, "days"),
        link: `${appInfo.clientDomain}/change-password?t=12345`,
    };

    const existingUserHTML = forganizationotPasswordEmailHTML(props);
    const existingUserText = forganizationotPasswordEmailText(props);

    fs.writeFileSync(forganizationotPasswordHTMLTemplateFile, existingUserHTML);
    fs.writeFileSync(forganizationotPasswordTextTemplateFile, existingUserText);
}

// Confirm email address email
const comfirmEmailAddressHTMLFile =
    "email-templates/templates/confirm-email-address-html.html";
const confirmEmailAddressTxtFile =
    "email-templates/templates/confirm-email-address-text.txt";

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

// Collaborator removed
const collaboratorRemovedHTMLFile =
    "email-templates/templates/collaborator-removed-html.html";
const collaboratorRemovedTxtFile =
    "email-templates/templates/collaborator-removed-text.txt";

export function renderCollaboratorRemovedMedia() {
    const props: ICollaboratorRemovedEmailProps = {
        organizationName: "Softkave",
    };

    const existingUserHTML = collaboratorRemovedEmailHTML(props);
    const existingUserText = collaboratorRemovedEmailText(props);

    fs.writeFileSync(collaboratorRemovedHTMLFile, existingUserHTML);
    fs.writeFileSync(collaboratorRemovedTxtFile, existingUserText);
}
