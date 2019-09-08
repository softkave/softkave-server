import moment from "moment";

import appInfo from "../res/appInfo";
import { html } from "./util";

export interface ICollaborationRequestParameters {
  signupLink: string;
  loginLink: string;
  fromUser: string;
  fromOrg: string;
  message: string;
  expiration: string | number;
}

const collaborationRequestMailTitle = `Collaboration Request Notification`;

function collaborationRequestHTML({
  signupLink,
  loginLink,
  fromUser,
  fromOrg,
  message,
  expiration
}: ICollaborationRequestParameters) {
  const content = `
  <div
    id=""
    class="sk-header-2"
    style="text-align: center; padding: 24px;     padding-top: 40px;
    padding-bottom: 48px; border-radius: 0;"
  >
    <!--<h4
      class="text-center text-secondary"
      style="margin: auto; max-width: 500px; color: #333 !important;"
    >
    ${collaborationRequestMailTitle}<br />
    </h4>-->
    <div class="line"></div>
    <div
      class="float-none"
      style="margin: auto;  color: #222;   line-height: 32px; max-width: 500px;"
    >
      <p>
        You have a new collaboration request from
        <b>${fromUser}</b> of
        <b>${fromOrg}</b>
        .<br />
      </p>
      <p>
      ${message ? `Message - ${message}` : ""}<br />
      </p>
      <p style="margin-bottom: 0;">
        ${
          expiration
            ? `This request expires: ${moment(expiration).format(
                appInfo.defaultDateFormat
              )}.`
            : ""
        }<br />
        To respond,<br />
        Login to your account
        <a href="${loginLink}">here</a>

        <br />
        OR signup if you don't have one,
        <a href="${signupLink}">here</a
        >&nbsp;
      </p>
    </div>
  </div>
  `;

  return html(content);
}

function collaborationRequestText({
  signupLink,
  loginLink,
  fromUser,
  fromOrg,
  expiration
}: ICollaborationRequestParameters) {
  return `
    You have a new collaboration request from ${fromUser} of ${fromOrg}.
    To respond, login to your account using this link ( ${loginLink} ) OR
    signup using this link ( ${signupLink} ) if you don't have one.
    ${
      expiration
        ? `It expires: ${moment(expiration).format(appInfo.defaultDateFormat)}.`
        : ""
    }
  `;
}

export {
  collaborationRequestHTML,
  collaborationRequestText,
  collaborationRequestMailTitle
};
