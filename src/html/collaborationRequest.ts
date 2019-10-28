import { Moment } from "moment";
import {
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
  message: string;
  expiration: Moment;
  recipientIsUser: boolean;
}

function getExpiration(props: ICollaborationRequestEmailProps) {
  return `
  ${
    props.expiration
      ? `
      This request is set to expires
      ${props.expiration.fromNow()}, on
      ${props.expiration.format("MM/DD/YYYY hh:mmA")}.
    `
      : `
      This request has no expiration date.
    `
  }
  `;
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
          , open the app menu, goto Notifications and you'll find the request there.<br />
          ${
            props.recipientIsUser ? `Login` : `Signup`
          } > Open app menu > Notifications
        </p>
        <p>
          Thanks, have a nice day.
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
  return `
  ${getHeaderText(collaborationRequestEmailTitle)}
  \n\n
  You have a new collaboration request from ${props.senderName} of ${
    props.senderOrg
  }.
  ${
    props.message
      ? `
      \n\n
      Message :-\n
      ${props.message}
    `
      : ""
  }
  \n\n
  Expiration :-\n
  ${getExpiration(props)}
  \n\n
  To respond to this request,\n
  ${
    props.recipientIsUser
      ? `
      Login to your account using :-\n
      ${props.loginLink}
    `
      : `
      Create an account using :-\n
      ${props.signupLink}
    `
  }
  , open the app menu, goto Notifications and you'll find the request there.
  ${props.recipientIsUser ? `Login` : `Signup`} > Open app menu > Notifications
  \n\n
  Thanks, have a nice day.
  `;
}
