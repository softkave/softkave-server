import appInfo from "../res/appInfo";

export function getFooterHTML() {
  return `
  <footer class="email-footer">
    &copy; ${appInfo.appName} ${new Date().getFullYear()}
  </footer>
  `;
}

export function getHeaderHTML(title) {
  return `
  <header class="email-header">
    <h1 class="email-content-center">${appInfo.appName} - ${title}</h1>
  </header>
  `;
}

export function getHeaderText(title) {
  const textBlocks = [`${appInfo.appName} - ${title}`];

  return textBlocks.join("");
}

export function getTemplateStylesHTML() {
  return `
  .email-header {
    text-align: left;
  }

  .email-header h1 {
    font-size: 22px;
  }

  .email-body {
    margin-top: 32px;
    margin-bottom: 32px;
  }

  .email-content-center {
    max-width: 520px;
    padding-left: 16px;
    padding-right: 16px;
    margin: auto;
  }

  .email-footer {
    text-align: center;
  }
  `;
}

export function getEndGreeting() {
  return "Thank you, and have a nice day.";
}
