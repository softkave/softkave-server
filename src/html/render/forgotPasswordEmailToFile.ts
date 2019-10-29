import fs from "fs";
import moment from "moment";
import appInfo from "../../res/appInfo";
import {
  forgotPasswordEmailHTML,
  forgotPasswordEmailText,
  IForgotPasswordEmailProps
} from "../forgotPasswordEmail";

const forgotPasswordHTMLTemplateFile =
  "email-templates/templates/forgot-password-html.html";
const forgotPasswordTextTemplateFile =
  "email-templates/templates/forgot-password-text.txt";

export default function renderForgotPasswordEmailToFile() {
  const props: IForgotPasswordEmailProps = {
    expiration: moment().add(2, "days"),
    link: `${appInfo.clientDomain}/change-password?t=12345`
  };

  const existingUserHTML = forgotPasswordEmailHTML(props);
  const existingUserText = forgotPasswordEmailText(props);

  fs.writeFileSync(forgotPasswordHTMLTemplateFile, existingUserHTML);
  fs.writeFileSync(forgotPasswordTextTemplateFile, existingUserText);
}
