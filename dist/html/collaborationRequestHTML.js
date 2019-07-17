"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const collaborationRequestMailTitle = `Collaboration Request Notification`;
exports.collaborationRequestMailTitle = collaborationRequestMailTitle;
function collaborationRequestHTML({ signupLink, loginLink, fromUser, fromOrg, message, expiration }) {
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
      ${message ? message : ""}<br />
      </p>
      <p style="margin-bottom: 0;">
        ${expiration ? `This request expires: ${expiration}.` : ""}<br />
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
    return util_1.html(content);
}
exports.collaborationRequestHTML = collaborationRequestHTML;
function collaborationRequestText({ signupLink, loginLink, fromUser, fromOrg, expiration }) {
    return `
    You have a new collaboration request from ${fromUser} of ${fromOrg}.
    To respond, login to your account using this link ( ${loginLink} ) OR
    signup using this link ( ${signupLink} ) if you don't have one.
    It expires: ${expiration}.
  `;
}
exports.collaborationRequestText = collaborationRequestText;
//# sourceMappingURL=collaborationRequestHTML.js.map