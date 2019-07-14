const querystring = require("querystring");

const aws = require("../../res/aws");
const { appInfo } = require("../../res/app");
const {
  changePasswordHTML,
  changePasswordText,
  changePasswordMailTitle
} = require("../../html/change-password");

const ses = new aws.SES();
const clientDomain = appInfo.clientDomain;
const changePasswordRoute = "/change-password";

async function sendChangePasswordEmail({ emailAddress, query, expiration }) {
  const link = `${clientDomain}${changePasswordRoute}?${querystring.stringify(
    query
  )}`;

  const htmlContent = changePasswordHTML({ link, expiration });
  const textContent = changePasswordText({ link, expiration });

  const result = await ses
    .sendEmail({
      Destination: {
        ToAddresses: [emailAddress]
      },
      Source: appInfo.defaultEmailSender,
      Message: {
        Subject: {
          Charset: appInfo.defaultEmailEncoding,
          Data: changePasswordMailTitle
        },
        Body: {
          Html: {
            Charset: appInfo.defaultEmailEncoding,
            Data: htmlContent
          },
          Text: {
            Charset: appInfo.defaultEmailEncoding,
            Data: textContent
          }
        }
      }
    })
    .promise();

  return result;
}

module.exports = sendChangePasswordEmail;
export {};
