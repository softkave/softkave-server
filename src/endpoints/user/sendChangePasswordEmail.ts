import {Moment} from 'moment';
import * as querystring from 'querystring';
import {
  forgotPasswordEmailHTML,
  forgotPasswordEmailText,
  forgotPasswordEmailTitle,
} from '../../html/forgotPassword';
import {IBaseContext} from '../contexts/IBaseContext';
import sendEmail from '../sendEmail';

export interface ISendChangePasswordEmailParameters {
  emailAddress: string;
  query: Record<string, string | number | boolean>;
  expiration: Moment;
}

async function sendChangePasswordEmail(
  ctx: IBaseContext,
  {emailAddress, query, expiration}: ISendChangePasswordEmailParameters
) {
  const link = `${ctx.appVariables.changePasswordPath}?${querystring.stringify(query)}`;
  const htmlContent = forgotPasswordEmailHTML({
    link,
    expiration: expiration.toDate(),
  });
  const textContent = forgotPasswordEmailText({
    link,
    expiration: expiration.toDate(),
  });
  return await sendEmail(ctx, {
    htmlContent,
    textContent,
    title: forgotPasswordEmailTitle,
    emailAddresses: [emailAddress],
  });
}

export default sendChangePasswordEmail;
