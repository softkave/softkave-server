const aws = require("../../res/aws");
const {
  collaborationRequestHTML,
  collaborationRequestText,
  collaborationRequestMailTitle
} = require("../../html/collaboration-request");
const { appInfo } = require("../../res/app");

const ses = new aws.SES();
const clientSignupRoute = "/signup";
const clientLoginRoute = "/login";

async function sendCollabReqEmail({
  email,
  userName,
  blockName,
  message,
  expires
}) {
  const signupLink = `${appInfo.clientDomain}${clientSignupRoute}`;
  const loginLink = `${appInfo.clientDomain}${clientLoginRoute}`;
  const contentParams = {
    message,
    signupLink,
    loginLink,
    expiration: expires,
    fromOrg: blockName,
    fromUser: userName
  };

  const htmlContent = collaborationRequestHTML(contentParams);
  const textContent = collaborationRequestText(contentParams);

  const result = await ses
    .sendEmail({
      Destination: {
        ToAddresses: [email]
      },
      Source: appInfo.defaultEmailSender,
      Message: {
        Subject: {
          Charset: appInfo.defaultEmailEncoding,
          Data: collaborationRequestMailTitle
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

module.exports = sendCollabReqEmail;
