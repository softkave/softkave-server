import { Moment } from "moment";
import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getTemplateStylesHTML,
} from "./helpers";

export const forganizationotPasswordEmailTitle = "Change Your Password";

export interface IForganizationotPasswordEmailProps {
    link: string;
    expiration: Moment;
}

export function forganizationotPasswordEmailHTML(
    props: IForganizationotPasswordEmailProps
) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>${getHeaderText(forganizationotPasswordEmailTitle)}</title>
        <style>
        ${getTemplateStylesHTML()}
        </style>
    </head>
    <body>
        ${getHeaderHTML(forganizationotPasswordEmailTitle)}
        <p>
            To change your password,
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
            <strong>
                This link expires in ${props.expiration.fromNow(
                    true
                )}, on ${props.expiration.format("MM/DD/YYYY hh:mmA")}
            </strong>
        </p>
        <p>
            If you did not request a change of password, please ignore this
            mail.
            <br />
            Also, do not share this link with anybody, as they'll be able to
            change your password with it.
            <br /><br />
            ${getEndGreeting()}
        </p>
        ${getFooterHTML()}
    </body>
    </html>
  `;
}

export function forganizationotPasswordEmailText(
    props: IForganizationotPasswordEmailProps
) {
    const txt = `
    ${getHeaderText(forganizationotPasswordEmailTitle)}

    To change your password, copy the following link, and visit in your browser - 
    ${props.link}

    This link expires:
    - Immediately after you change your password, or
    - In ${props.expiration.fromNow(true)}, on ${props.expiration.format(
        "MM/DD/YYYY hh:mmA"
    )}

    If you did not request a change of password, please ignore this mail.
    Also, do not share this link with anybody, as they'll be able to change your password with it.

    ${getEndGreeting()}
    `;

    return txt;
}
