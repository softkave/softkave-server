import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getTemplateStylesHTML,
} from "./helpers";

export interface ICollaborationRequestRevokedEmailProps {
    title: string;
    senderName: string;
}

export function collaborationRequestRevokedEmailHTML(
    props: ICollaborationRequestRevokedEmailProps
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
            This is to notify you that the collaboration request sent from ${
                props.senderName
            } has been revoked.
        </p>
        <p>
        ${getEndGreeting()}
        </p>
        ${getFooterHTML()}
    </body>
    </html>
    `;
}

export function collaborationRequestRevokedEmailText(
    props: ICollaborationRequestRevokedEmailProps
) {
    const txt = `
    ${getHeaderText(props.title)}

    This is to notify you that the collaboration request sent from ${
        props.senderName
    } has been revoked.

    ${getEndGreeting()}
    `;

    return txt;
}
