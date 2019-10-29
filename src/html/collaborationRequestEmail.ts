import { Moment } from "moment";
import {
  getEndGreeting,
  getFooterHTML,
  getHeaderHTML,
  getHeaderText,
  getTemplateStylesHTML
} from "./helpers";

export const collaborationRequestEmailTitle = "Collaboration Request";

export interface ICollaborationRequestEmailProps {
  signupLink: string;
  loginLink: string;
  senderName: string;
  senderOrg: string;
  recipientIsUser: boolean;
  message?: string;
  expiration?: Moment;
}

function getExpiration(props: ICollaborationRequestEmailProps) {
  return `${
    props.expiration
      ? `This request is set to expire ${props.expiration.fromNow()}, on ${props.expiration.format(
          "MM/DD/YYYY hh:mmA"
        )}.`
      : `This request has no expiration date.`
  }`;
}

export function collaborationRequestEmailHTML(
  props: ICollaborationRequestEmailProps
) {
  return `
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8" />
    <title>${getHeaderText(collaborationRequestEmailTitle)}</title>
    <style>
      ${getTemplateStylesHTML()}
    </style>
  </head>

  <body>
    ${getHeaderHTML(collaborationRequestEmailTitle)}
    <div class="email-body">
      <div class="email-content-center">
        <p>
          You have a new collaboration request from
          ${props.senderName} of ${props.senderOrg}.
        </p>
        ${
          props.message
            ? `
            <p>
              <b>Message :-</b><br />
              ${props.message}
            </p>
          `
            : ""
        }
        <p>
          <b>Expiration :-</b><br />
          ${getExpiration(props)}
        </p>
        <p>
          To respond to this request,
          ${
            props.recipientIsUser
              ? `
              <a href="${props.loginLink}">Login to your account here</a>
            `
              : `
              <a href="${props.signupLink}">Signup here</a>
            `
          }
          <br />
          then, open the app menu, goto Notifications and you'll find the request there.<br />
          ${
            props.recipientIsUser ? `Login` : `Signup`
          } > Open app menu > Notifications
        </p>
        <p>
          ${getEndGreeting()}
        </p>
      </div>
    </div>
    ${getFooterHTML()}
  </body>

  </html>
  `;
}

export function collaborationRequestEmailText(
  props: ICollaborationRequestEmailProps
) {
  function getMessage() {
    return props.message ? `Message :-\n${props.message}` : "";
  }

  function getLink() {
    return props.recipientIsUser
      ? `Login to your account using :-\n${props.loginLink}`
      : `Create an account using :-\n${props.signupLink}`;
  }

  const message = getMessage();

  const textBlocks = [
    `${getHeaderText(collaborationRequestEmailTitle)}`,
    `\n\nYou have a new collaboration request from ${props.senderName} of ${props.senderOrg}`,
    `${message.length > 0 ? `\n\n${message}` : ""}`,
    `\n\nExpiration :-\n${getExpiration(props)}`,
    `\n\nTo respond to this request,\n${getLink()}`,
    `\n\nthen, open the app menu, goto Notifications and you'll find the request there.`,
    `\n${
      props.recipientIsUser ? `Login` : `Signup`
    } > Open app menu > Notifications`,
    `\n\n${getEndGreeting()}`
  ];

  return textBlocks.join("");
}
