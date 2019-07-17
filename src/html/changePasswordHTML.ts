import { html } from "./util";

export interface IChangePasswordHTMLParameters {
  link: string;
  expiration: string | number;
}

const changePasswordMailTitle = `Change Password`;

function changePasswordHTML({
  link,
  expiration
}: IChangePasswordHTMLParameters) {
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

  return html(content);
}

function changePasswordText({
  link,
  expiration
}: IChangePasswordHTMLParameters) {
  return `
    To change your password, visit this link ( ${link} ) in your browser.
    It expires: ${expiration}.
  `;
}

export { changePasswordHTML, changePasswordText, changePasswordMailTitle };
