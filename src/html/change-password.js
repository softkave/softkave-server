const { html } = require("./util");

const changePasswordMailTitle = `Change Password`;

function changePasswordHTML({ link, expiration }) {
  const content = `
    <div class="sk-main">
      <h2 class="sk-main-title">${changePasswordMailTitle}</h2>
      <p class="sk-paragraph">
        Click <a class="sk-link" href="${link}">here</a> to change your password, OR
        <br />
        Copy this link -
        <a class="sk-link" href="${link}">${link}</a>
        - and visit in your browser.
      </p>
      <p class="sk-paragraph">
        This link expires: ${expiration}.<br />
        If you did not request a change of password, please ignore this
        mail.<br />
        Also, do not share this link with anybody, as they will be able to
        change your password through it.
      </p>
    </div>
  `;

  return html(content);
}

function changePasswordText({ link, expiration }) {
  return `
    To change your password, visit this link ( ${link} ) in your browser.
    It expires: ${expiration}.
  `;
}

module.exports = {
  changePasswordHTML,
  changePasswordText,
  changePasswordMailTitle
};
