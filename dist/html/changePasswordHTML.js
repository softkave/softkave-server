"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const changePasswordMailTitle = `Change Password`;
exports.changePasswordMailTitle = changePasswordMailTitle;
function changePasswordHTML({ link, expiration }) {
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
    ${changePasswordMailTitle}<br />
    </h4>-->
    <div class="line"></div>
    <div
      class="float-none"
      style="margin: auto;  color: #222;   line-height: 32px; max-width: 500px;"
    >
      <p>
        Click <a href="${link}">here</a> to change your password, OR
        <br />
        Copy this link -
        <a href="${link}">${link}</a>
        - and visit in your browser.
      </p>
      <p>
        This link expires after ${expiration}.<br />
        If you did not request a change of password, please ignore this
        mail.<br />
        Also, do not share this link with anybody, as they will be able to
        change your password through it
      </p>

    </div>
  </div>
  `;
    return util_1.html(content);
}
exports.changePasswordHTML = changePasswordHTML;
function changePasswordText({ link, expiration }) {
    return `
    To change your password, visit this link ( ${link} ) in your browser.
    It expires: ${expiration}.
  `;
}
exports.changePasswordText = changePasswordText;
//# sourceMappingURL=changePasswordHTML.js.map