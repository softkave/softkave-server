const querystring = require("querystring");
const aws = require("../res/aws");
const ses = new aws.SES();

const appName = "Softkave";
const clientDomain = process.env.CLIENT_DOMAIN || "https://www.softkave.com";

async function sendChangePasswordEmail(emailAddress, query) {
  let title = "Change Password";
  let verifyLink = `${clientDomain}/change-password?${querystring.stringify(
    query
  )}`;

  let emailData = `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <meta charset="utf-8">
        <meta name="author" content="Abayomi Akintomide" >
        <title>${title}</title>
        <style>
          * {color: #222;}
          a {color: rgb(66, 133, 244);}
          footer {whitespace: pre;}
          .app-name {font-size: 1em; margin: 0.5em 0; font-weight: bold;}
          .mail-title {font-size: 2em;}
        </style>
      </head>
      <body>
        <header>
          <h1 className="app-name"><a href="${clientDomain}">${appName}</a></h1>
          <h2 className="mail-title">${title}</h2>
        </header>
        <p>
          Click 
          <a href="${verifyLink}">
            here
          </a>
          to change your password with ${appName} OR
        </p>
        <p>
          Copy this link, and visit in your browser <br ><br >
          <a href=${verifyLink}>
            ${verifyLink}
          </a>
        </p>
        <p>
          If you did not request this mail on 
          <a href="${clientDomain}" className="app-name">${appName}</a>, 
          ignore this mail.
        </p>
        <footer>&copy;  ${appName}</footer>
      </body>
    </html>
  `;

  let result = await ses
    .sendEmail({
      Destination: {
        ToAddresses: [emailAddress]
      },
      Source: "softkave@softkave.com",
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: title
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: emailData
          },
          Text: {
            Charset: "UTF-8",
            Data: `
            To verify your email with ${appName}, copy the following link
            -
            ${verifyLink}
            -
            and visit in your browser. Thank you!
          `
          }
        }
      }
    })
    .promise();

  return result;
}

module.exports = sendChangePasswordEmail;
