const { html } = require("./util");
const { appName } = require("../res/app");

const collaborationRequestMailTitle = `Collaboration Request Notification`;

function collaborationRequestHTML({
  signupLink,
  loginLink,
  fromUser,
  fromOrg,
  message,
  expiration
}) {
  const content = `
    <div class="sk-main">
      <h2 class="sk-main-title">${collaborationRequestMailTitle}</h2>
      <p class="sk-paragraph">
        You have a new collaboration request from ${fromUser} of
        ${fromOrg}.
      </p>
      <p class="sk-paragraph">
        ${message ? message : ""}
        <br />
        ${expiration ? `This request expires: ${expiration}.` : ""}
      </p>
      <p class="sk-paragraph">
        To respond to this request,
        <br />
        <a class="sk-link" href="${loginLink}">login</a>
        ( <a class="sk-link" href="${loginLink}">${loginLink}</a> ) to
        your <span>${appName}</span> account if you have one, OR
        <a class="sk-link" href="${signupLink}">signup here</a>
        ( <a class="sk-link" href="${signupLink}">${signupLink}</a> ) if
        you don't.
      </p>
    </div>
  `;

  return html(content);
}

function collaborationRequestText({
  signupLink,
  loginLink,
  fromUser,
  fromOrg,
  message,
  expiration
}) {
  return `
    You have a new collaboration request from ${fromUser} of ${fromOrg}.
    To respond, login to your account using this link ( ${loginLink} ) OR
    signup using this link ( ${signupLink} ) if you don't have one.
    It expires: ${expiration}.
  `;
}

module.exports = {
  collaborationRequestHTML,
  collaborationRequestText,
  collaborationRequestMailTitle
};
