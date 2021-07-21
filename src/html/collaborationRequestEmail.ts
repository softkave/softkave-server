import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getNewlines,
    getTemplateStylesHTML,
} from "./helpers";

export interface ICollaborationRequestEmailProps {
    signupLink: string;
    loginLink: string;
    senderName: string;
    senderOrganization: string;
    recipientIsUser: boolean;
    title: string;
}

export function collaborationRequestEmailHTML(
    props: ICollaborationRequestEmailProps
) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>${getHeaderText(props.title)}</title>
        <style>
        ${getTemplateStylesHTML()}
        </style>
    </head>
    <body>
        ${getHeaderHTML(props.title)}
        <p>
            You have a new collaboration request from
            <b>${props.senderName}</b> of <b>${props.senderOrganization}</b>.
        </p>
        <p>
            To respond to this request,
            ${
                props.recipientIsUser
                    ? `<a href="${props.loginLink}">Login to your account here</a>`
                    : `<a href="${props.signupLink}">Signup here</a>`
            }
        </p>
        <p>
        ${getEndGreeting()}
        </p>
        ${getFooterHTML()}
    </body>

    </html>
    `;
}

export function collaborationRequestEmailText(
    props: ICollaborationRequestEmailProps
) {
    function getLink() {
        return props.recipientIsUser
            ? `login to your account here - ${getNewlines()}${props.loginLink}`
            : `create an account here - ${getNewlines()}${props.signupLink}`;
    }

    const txt = `
    ${getHeaderText(props.title)}

    You have a new collaboration request from ${props.senderName} of ${
        props.senderOrganization
    }

    To respond to this request, ${getLink()}

    ${getEndGreeting()}
    `;

    return txt;
}
