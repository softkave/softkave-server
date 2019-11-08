import { Moment } from "moment";
import {
  getEndGreeting,
  getFooterHTML,
  getHeaderHTML,
  getHeaderText,
  getTemplateStylesHTML
} from "./helpers";

export const forgotPasswordEmailTitle = "Change Your Password";

export interface IForgotPasswordEmailProps {
  link: string;
  expiration: Moment;
}

export function forgotPasswordEmailHTML(props: IForgotPasswordEmailProps) {
  return `
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8" />
    <title>${getHeaderText(forgotPasswordEmailTitle)}</title>
    <style>
      ${getTemplateStylesHTML()}
    </style>
  </head>

  <body>
    ${getHeaderHTML(forgotPasswordEmailTitle)}
    <div class="email-body">
      <div class="email-content-center">
        <p>
          To change your password,
          <a href="${props.link}">Click here</a>
        </p>
        <p>- OR -</p>
        <p>
          Copy the following link, and visit in your browser :-<br />
          <a href="${props.link}">${props.link}</a>
        </p>
        <div>
          <strong>This link expires :-</strong>
          <ul>
            ${
              /*
              TODO: Waiting to implement revoking used forgot password tokens
              <li><strong>Immediately after you change your password</strong> OR</li> */ ""
            }
            <li><strong>In ${props.expiration.fromNow(
              true
            )}, on ${props.expiration.format("MM/DD/YYYY hh:mmA")}</strong></li>
          </ul>
        </div>
        <p>
          If you did not request a change of password, please ignore this
          mail.<br />
          Also, do not share this link with anybody, as they will be able to
          change your password through it.
          <br /><br />
          ${getEndGreeting()}
        </p>
      </div>
    </div>
    ${getFooterHTML()}
  </body>

  </html>
  `;
}

export function forgotPasswordEmailText(props: IForgotPasswordEmailProps) {
  const textBlocks = [
    `${getHeaderText(forgotPasswordEmailTitle)}`,
    `\n\nTo change your password, copy the following link, and visit in your browser :-\n${props.link}`,
    `\n\nThis link expires :-\n`,
    `- Immediately after you change your password OR\n`,
    `- In ${props.expiration.fromNow(true)}, on ${props.expiration.format(
      "MM/DD/YYYY hh:mmA"
    )}`,
    `\n\nIf you did not request a change of password, please ignore this mail.`,
    `\nAlso, do not share this link with anybody, as they will be able to`,
    `\n\n${getEndGreeting()}`
  ];

  return textBlocks.join("");
}
