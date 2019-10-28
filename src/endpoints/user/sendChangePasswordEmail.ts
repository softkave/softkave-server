import { Moment } from "moment";
import querystring from "querystring";
import {
  forgotPasswordEmailHTML,
  forgotPasswordEmailText,
  forgotPasswordEmailTitle
} from "../../html/forgotPassword";
import appInfo from "../../res/appInfo";
import aws from "../../res/aws";

const ses = new aws.SES();
const clientDomain = appInfo.clientDomain;
const changePasswordRoute = "/change-password";

export interface ISendChangePasswordEmailParameters {
  emailAddress: string;
  query: any;
  expiration: Moment;
}

async function sendChangePasswordEmail({
  emailAddress,
  query,
  expiration
}: ISendChangePasswordEmailParameters) {
  const link = `${clientDomain}${changePasswordRoute}?${querystring.stringify(
    query
  )}`;

  const htmlContent = forgotPasswordEmailHTML({ link, expiration });
  const textContent = forgotPasswordEmailText({ link, expiration });

  const result = await ses
    .sendEmail({
      Destination: {
        ToAddresses: [emailAddress]
      },
      Source: appInfo.defaultEmailSender,
      Message: {
        Subject: {
          Charset: appInfo.defaultEmailEncoding,
          Data: forgotPasswordEmailTitle
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
