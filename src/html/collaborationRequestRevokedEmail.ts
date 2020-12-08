import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getNewlines,
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
        <div class="email-body">
            <div class="email-content-center">
                <p>
                    This is to notify you that the collaboration request sent from ${
                        props.senderName
                    } has been revoked.
                </p>
                <p>
                ${getEndGreeting()}
                </p>
            </div>
        </div>
        ${getFooterHTML()}
    </body>

    </html>
    `;
}

export function collaborationRequestRevokedEmailText(
    props: ICollaborationRequestRevokedEmailProps
) {
    const textBlocks = [
        getHeaderText(props.title),
        getNewlines(2),
        `This is to notify you that the collaboration request sent from ${props.senderName} has been revoked.`,
        getNewlines(2),
        `${getEndGreeting()}`,
    ];

    return textBlocks.join("");
}
