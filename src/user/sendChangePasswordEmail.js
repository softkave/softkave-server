const querystring = require("querystring");
const aws = require("../res/aws");
const {
  changePasswordHTML,
  changePasswordText,
  changePasswordMailTitle
} = require("../html/change-password");

const ses = new aws.SES();
const clientDomain = process.env.CLIENT_DOMAIN || "https://www.softkave.com";

async function sendChangePasswordEmail(emailAddress, query, expiration) {
  const link = `${clientDomain}/change-password?${querystring.stringify(
    query
  )}`;

  const htmlContent = changePasswordHTML({ link, expiration });
  const textContent = changePasswordText({ link, expiration });

  const result = await ses
    .sendEmail({
      Destination: {
        ToAddresses: [emailAddress]
      },
      Source: "softkave@softkave.com",
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: changePasswordMailTitle
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlContent
          },
          Text: {
            Charset: "UTF-8",
            Data: textContent
          }
        }
      }
    })
    .promise();

  return result;
}

module.exports = sendChangePasswordEmail;
