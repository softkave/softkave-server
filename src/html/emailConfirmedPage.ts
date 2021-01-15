import { IUser } from "../mongo/user";
import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getTemplateStylesHTML,
} from "./helpers";

export const emailConfirmedTitle = "Your Email Address has been Confirmed";

export interface IGenerateEmailConfirmedPageProps {
    user: IUser;
    loginLink: string;
}

export function generateEmailConfirmedHTML(
    props: IGenerateEmailConfirmedPageProps
) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>${getHeaderText(emailConfirmedTitle)}</title>
        <style>
        ${getTemplateStylesHTML()}
        </style>
    </head>
    <body>
        ${getHeaderHTML(emailConfirmedTitle)}
        <p>
            Hi ${
                props.user.name
            }, good news, your email address has been confirmed!
            <b />
            You can login to your acount 
            <a href="${props.loginLink}">here</a>
            <br /><br />
            ${getEndGreeting()}
        </p>
        ${getFooterHTML()}
    </body>
    </html>
  `;
}
