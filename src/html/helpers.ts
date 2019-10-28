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
    <h1>${appInfo.appName} - ${title}</h1>
  </header>
  `;
}

export function getHeaderText(title) {
  return `
  ${appInfo.appName} - ${title}
  `;
}

export function getTemplateStylesHTML() {
  return `
  .email-header {
    text-align: center;
  }

  .email-body {
    margin-top: 48px;
    margin-bottom: 48px;
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
