import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getTemplateStylesHTML,
} from "./helpers";

export interface ICollaboratorRemovedEmailProps {
    organizationName: string;
}

export function collaboratorRemovedEmailHTML(
    props: ICollaboratorRemovedEmailProps
) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>${getHeaderText("Collaborator Removed")}</title>
        <style>
        ${getTemplateStylesHTML()}
        </style>
    </head>
    <body>
        ${getHeaderHTML("Collaborator Removed")}
        <p>
            This is to notify you that you have been removed from ${
                props.organizationName
            }.
        </p>
        <p>
        ${getEndGreeting()}
        </p>
        ${getFooterHTML()}
    </body>
    </html>
    `;
}

export function collaboratorRemovedEmailText(
    props: ICollaboratorRemovedEmailProps
) {
    const txt = `
    ${getHeaderText("Collaborator Removed")}

    This is to notify you that you have been removed from ${
        props.organizationName
    }.

    ${getEndGreeting()}
    `;

    return txt;
}
