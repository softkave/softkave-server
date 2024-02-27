import * as aws from 'aws-sdk';
import {PromiseResult} from 'aws-sdk/lib/request';
import {IBaseContext} from './contexts/IBaseContext';

const ses = new aws.SES();

export interface ISendEmailProps {
  emailAddresses: string[];
  title: string;
  htmlContent: string;
  textContent: string;
}

async function sendEmail(
  ctx: IBaseContext,
  props: ISendEmailProps
): Promise<PromiseResult<aws.SES.SendEmailResponse, aws.AWSError> | null> {
  if (ctx.appVariables.disableEmail) {
    return null;
  }

  const {emailAddresses, title, textContent, htmlContent} = props;
  try {
    const result = await ses
      .sendEmail({
        Destination: {
          ToAddresses: emailAddresses,
        },
        Source: ctx.appVariables.emailSendFrom,
        Message: {
          Subject: {
            Charset: ctx.appVariables.emailEncoding,
            Data: title,
          },
          Body: {
            Html: {
              Charset: ctx.appVariables.emailEncoding,
              Data: htmlContent,
            },
            Text: {
              Charset: ctx.appVariables.emailEncoding,
              Data: textContent,
            },
          },
        },
      })
      .promise();

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default sendEmail;
