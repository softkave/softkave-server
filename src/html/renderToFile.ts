import * as fs from 'fs';
import * as moment from 'moment';
import {appVariables} from '../resources/appVariables';
import {
  collaborationRequestEmailHTML,
  collaborationRequestEmailText,
  ICollaborationRequestEmailProps,
} from './collaborationRequest';
import {
  collaboratorRemovedEmailHTML,
  collaboratorRemovedEmailText,
  ICollaboratorRemovedEmailProps,
} from './collaboratorRemoved';
import {
  confirmEmailAddressEmailHTML,
  confirmEmailAddressEmailText,
  IConfirmEmailAddressEmailProps,
} from './confirmEmailAddress';
import {
  forgotPasswordEmailHTML,
  forgotPasswordEmailText,
  IForgotPasswordEmailProps,
} from './forgotPassword';

// Collaboration request email
const existingUserHTMLTemplateFile =
  'email-templates/templates/collaboration-request-existing-user-html.html';
const newUserHTMLTemplateFile =
  'email-templates/templates/collaboration-request-new-user-html.html';
const existingIsUserTextTemplateFile =
  'email-templates/templates/collaboration-request-existing-user-text.txt';
const newUserTextTemplateFile = 'email-templates/templates/collaboration-request-new-user-text.txt';

export function renderCollaborationRequestEmailToFile() {
  const existingUserProps: ICollaborationRequestEmailProps = {
    loginLink: `${appVariables.clientDomain}/login`,
    isRecipientAUser: true,
    workspaceName: 'Softkave',
    signupLink: `${appVariables.clientDomain}/signup`,
    message: 'Hello World!',
    expires: moment().add(1, 'days').toDate().toUTCString(),
  };

  const newUserProps: ICollaborationRequestEmailProps = {
    loginLink: `${appVariables.clientDomain}/login`,
    isRecipientAUser: false,
    workspaceName: 'Softkave',
    signupLink: `${appVariables.clientDomain}/signup`,
    message: 'Hello World!',
    expires: moment().add(1, 'days').toDate().toUTCString(),
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
  'email-templates/templates/forganizationot-password-html.html';
const forganizationotPasswordTextTemplateFile =
  'email-templates/templates/forganizationot-password-text.txt';

export function renderForganizationotPasswordEmailToFile() {
  const props: IForgotPasswordEmailProps = {
    expiration: moment().add(2, 'days').toDate(),
    link: `${appVariables.clientDomain}/change-password?t=12345`,
  };

  const existingUserHTML = forgotPasswordEmailHTML(props);
  const existingUserText = forgotPasswordEmailText(props);

  fs.writeFileSync(forganizationotPasswordHTMLTemplateFile, existingUserHTML);
  fs.writeFileSync(forganizationotPasswordTextTemplateFile, existingUserText);
}

// Confirm email address email
const comfirmEmailAddressHTMLFile = 'email-templates/templates/confirm-email-address-html.html';
const confirmEmailAddressTxtFile = 'email-templates/templates/confirm-email-address-text.txt';

export function renderConfirmEmailAddressMedia() {
  const props: IConfirmEmailAddressEmailProps = {
    link: `${appVariables.confirmEmailAddressPath}`,
    firstName: 'John',
  };

  const existingUserHTML = confirmEmailAddressEmailHTML(props);
  const existingUserText = confirmEmailAddressEmailText(props);

  fs.writeFileSync(comfirmEmailAddressHTMLFile, existingUserHTML);
  fs.writeFileSync(confirmEmailAddressTxtFile, existingUserText);
}

// Collaborator removed
const collaboratorRemovedHTMLFile = 'email-templates/templates/collaborator-removed-html.html';
const collaboratorRemovedTxtFile = 'email-templates/templates/collaborator-removed-text.txt';

export function renderCollaboratorRemovedMedia() {
  const props: ICollaboratorRemovedEmailProps = {
    organizationName: 'Softkave',
    loginLink: `${appVariables.clientDomain}/login`,
    signupLink: `${appVariables.clientDomain}/signup`,
  };

  const existingUserHTML = collaboratorRemovedEmailHTML(props);
  const existingUserText = collaboratorRemovedEmailText(props);

  fs.writeFileSync(collaboratorRemovedHTMLFile, existingUserHTML);
  fs.writeFileSync(collaboratorRemovedTxtFile, existingUserText);
}
