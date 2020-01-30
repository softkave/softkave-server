import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ISendChangePasswordEmailContext } from "./types";
import { ISendChangePasswordEmailParameters } from "../sendChangePasswordEmail";
import { Moment } from "moment";
import aws from "res/aws";
import appInfo from "res/appInfo";
import querystring from "querystring";
import {
  forgotPasswordEmailHTML,
  forgotPasswordEmailText,
  forgotPasswordEmailTitle
} from "../../../html/forgotPasswordEmail";

export interface ISendChangePasswordEmailContextParameters
  extends IBaseEndpointContextParameters {
  data: ISendChangePasswordEmailParameters;
}
// const ses = new aws.SES();
// const clientDomain = appInfo.clientDomain;
// const changePasswordRoute = "/change-password";
const crucialData = {
  ses: new aws.SES(),
  clientDomain: appInfo.clientDomain,
  changePasswordRoute: "/change-password"
};

export default class SendChangePasswordEmailContext 
  extends BaseEndpointContext
  implements ISendChangePasswordEmailContext {
  public data: ISendChangePasswordEmailParameters;

  constructor(p: ISendChangePasswordEmailContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async sendChangePasswordEmail(
    emailAddress: string,
    query: any,
    expiration: Moment
  ) {
    const link = `${crucialData.clientDomain}${
      crucialData.changePasswordRoute
    }?${querystring.stringify(query)}`;

    const htmlContent = forgotPasswordEmailHTML({ link, expiration });
    const textContent = forgotPasswordEmailText({ link, expiration });

    const result = await crucialData.ses
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
}
