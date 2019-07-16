import querystring from "querystring";

import {
  changePasswordHTML,
  changePasswordMailTitle,
  changePasswordText
} from "../../html/changePasswordHTML";
import appInfo from "../../res/appInfo";
import aws from "../../res/aws";

const ses = new aws.SES();
const clientDomain = appInfo.clientDomain;
const changePasswordRoute = "/change-password";

export interface ISendChangePasswordEmailParameters {
  emailAddress: string;
  query: any;
  expiration: string | number;
}

async function sendChangePasswordEmail({
  emailAddress,
  query,
  expiration
}: ISendChangePasswordEmailParameters) {
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

export default sendChangePasswordEmail;
