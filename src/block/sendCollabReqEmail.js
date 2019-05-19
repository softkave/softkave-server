const aws = require("../res/aws");
const {
  collaborationRequestHTML,
  collaborationRequestText,
  collaborationRequestMailTitle
} = require("../html/collaboration-request");
const { clientDomain } = require("../res/app");

const ses = new aws.SES();

async function sendCollabReqEmail(
  email,
  userName,
  blockName,
  message,
  expires
) {
  const signupLink = `${clientDomain}/signup`;
  const loginLink = `${clientDomain}/login`;
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
      Source: "softkave@softkave.com",
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: collaborationRequestMailTitle
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

module.exports = sendCollabReqEmail;
