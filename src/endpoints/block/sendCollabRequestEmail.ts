import {
  collaborationRequestHTML,
  collaborationRequestMailTitle,
  collaborationRequestText
} from "../../html/collaborationRequestHTML";
import appInfo from "../../res/appInfo";
import aws from "../../res/aws";

const ses = new aws.SES();
const clientSignupRoute = "/signup";
const clientLoginRoute = "/login";

export interface ISendCollaborationRequestEmailParameters {
  email: string;
  userName: string;
  blockName: string;
  message: string;
  expires: string | number;
}

async function sendCollabReqEmail({
  email,
  userName,
  blockName,
  message,
  expires
}: ISendCollaborationRequestEmailParameters) {
  return;
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

export default sendCollabReqEmail;
