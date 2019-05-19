const { appName } = require("../res/app");

const styles = `
  html,
  body {
    height: 100%;
  }

  body {
    font-family: "Karla", sans-serif;
    font-size: 14px;
    color: #555;
    margin: 0;
  }

  .sk-app-name,
  .sk-link {
    color: rgb(66, 133, 244);
  }

  .sk-mail-main {
    max-width: 700px;
    padding: 24px 0;
    box-sizing: border-box;
    margin: auto;
  }
`;

function html(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${appName}</title>
        <link
          href="https://fonts.googleapis.com/css?family=Karla"
          rel="stylesheet"
        />
        <style>${styles}</style>
      </head>
      <body>
        <div class="sk-mail-main">
          <div class="sk-header">
          <h1 class="sk-app-name">${appName}</h1>
          </div>
          ${content}
          <div class="sk-footer">
            &copy; ${appName}
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = {
  html
};
