import { userConstants } from "../endpoints/user/constants";
import { appVariables } from "../resources/appVariables";
import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getTemplateStylesHTML,
} from "./helpers";

export const emailConfirmationEmailTitle = "Confirm Your Email Address";

export interface IGenerateEmailConfirmationMediaProps {
    link: string;
    reminderCount: number;
}

// TODO: can we create a page, explaining why users have to confirm their email addresses?

export function generateEmailConfirmationHTML(
    props: IGenerateEmailConfirmationMediaProps
) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>${getHeaderText(emailConfirmationEmailTitle)}</title>
        <style>
        ${getTemplateStylesHTML()}
        </style>
    </head>
    <body>
        ${getHeaderHTML(emailConfirmationEmailTitle)}
        <p>
            To confirm your email address,
            <a href="${props.link}">click here</a>
        </p>
        <p>
            <b>- OR -</b>
        </p>
        <p>
            Copy the following link, and visit in your browser :-<br />
            <a href="${props.link}">${props.link}</a>
        </p>
        <p>
            Reminder count ${
                userConstants.maxEmailConfirmationCount - props.reminderCount
            } of ${userConstants.maxEmailConfirmationCount} left.
            <b /><b />
            After ${
                userConstants.maxEmailConfirmationCount
            } reminders, you won't be able to login to your account 
            until you confirm your email address. We know it kind of sucks, 
            but we are doing this to have a more trusted and reliable infrastructure.
        </p>
        <p>
            If you do not have an account with <b>${
                appVariables.appName
            }</b>, please ignore this
            mail.
            <br /><br />
            ${getEndGreeting()}
        </p>
        ${getFooterHTML()}
    </body>
    </html>
  `;
}

export function generateEmailConfirmationText(
    props: IGenerateEmailConfirmationMediaProps
) {
    const txt = `
    ${getHeaderText(emailConfirmationEmailTitle)}

    To confirm your email address, copy the following link, and visit in your browser -
    ${props.link}

    Reminder count ${
        userConstants.maxEmailConfirmationCount - props.reminderCount
    } of ${userConstants.maxEmailConfirmationCount} left.
    
    After ${
        userConstants.maxEmailConfirmationCount
    } reminders, you won't be able to login to your account 
    until you confirm your email address. We know it kind of sucks, 
    but we are doing this to have a more trusted and reliable infrastructure.

    If you do not have an account with ${
        appVariables.appName
    }, please ignore this mail.

    ${getEndGreeting()}
    `;

    return txt;
}
