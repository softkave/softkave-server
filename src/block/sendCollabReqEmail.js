const ses = require("../res/ses");

const appName = "Softkave";
const clientDomain = process.env.CLIENT_DOMAIN || "https://www.softkave.com";

async function sendCollabReqEmail(email, userName, blockName) {
  let title = "Collaboration Request";
  let verifyLink = `${clientDomain}`;
  let body = `
    You have a new collaboration request from ${userName} of ${blockName}. 
    To respond, login to your Softkave account if you have one, or signup if don't 
    by visiting the following link in your browser. Thank you! 
    - ${verifyLink}
  `;

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
          ${body}
          <br ><br >
          Or you can click below
          <br >
          <a href="${verifyLink}">
            ${verifyLink}
          </a> 
        </p>
        <footer>&copy; ${appName}</footer>
      </body>
    </html>
  `;

  let result = await ses
    .sendEmail({
      Destination: {
        ToAddresses: [email]
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
            ${body} 
          `
          }
        }
      }
    })
    .promise();

  return result;
}

module.exports = sendCollabReqEmail;
