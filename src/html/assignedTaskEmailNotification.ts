import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getTemplateStylesHTML,
} from "./helpers";

export const assignedTaskEmailNotificationTitle = "Assigned Task Notification";

export interface IAssignedTaskEmailNotificationProps {
    assignee: string;
    assigner: string;
    board: string;
    loginLink: string;
    taskName: string;
    taskDescription?: string;
}

export function assignedTaskEmailNotificationHTML(
    props: IAssignedTaskEmailNotificationProps
) {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>${getHeaderText(assignedTaskEmailNotificationTitle)}</title>
            <style>
                ${getTemplateStylesHTML()}
            </style>
        </head>
        <body>
        ${getHeaderHTML(assignedTaskEmailNotificationTitle)}
        <p>
            You have been assigned a task in <b>${props.board}</b> by 
            <b>${props.assigner}</b>.
        </p>
        <p>
            <b>Task:</b><br />
            ${props.taskName || props.taskDescription}
            ${
                props.taskDescription && props.taskName
                    ? `<br /><br /><b>Description:</b><br />${props.taskDescription}`
                    : ""
            }
        </p>
        <p>
            To view the assigned task,
            <a href="${props.loginLink}">Login to your account here</a>.
        </p>
        <p>
        ${getEndGreeting()}
        </p>
        ${getFooterHTML()}
        </body>
    </html>
    `;
}

export function assignedTaskEmailNotificationText(
    props: IAssignedTaskEmailNotificationProps
) {
    let txt = `
    ${getHeaderText(assignedTaskEmailNotificationTitle)}

    You have been assigned a task in ${props.board} by ${props.assigner}.

    Here is the task:
    ${props.taskName || props.taskDescription}
    `;

    if (props.taskDescription) {
        const txtDesc = `
Here is the task description:
${props.taskDescription}
`;

        txt += txtDesc;
    }

    const restTxt = `
    To view the assigned task, login to your account here - 
    ${props.loginLink}.

    ${getEndGreeting()}
    `;

    txt += restTxt;

    return txt;
}
