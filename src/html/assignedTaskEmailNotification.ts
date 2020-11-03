import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getNewlines,
    getTemplateStylesHTML,
} from "./helpers";

export const assignedTaskEmailNotificationTitle = "Assigned Task Notification";

export interface IAssignedTaskEmailNotificationProps {
    assignee: string;
    assigner: string;
    senderOrg: string;
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
        <div class="email-body">
            <div class="email-content-center">
                <p>
                    You have been assigned a task in <b>${
                        props.senderOrg
                    }</b> by <b>${props.assigner}</b>.
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
            </div>
        </div>
        ${getFooterHTML()}
        </body>
    </html>
    `;
}

export function assignedTaskEmailNotificationText(
    props: IAssignedTaskEmailNotificationProps
) {
    const textBlocks = [
        getHeaderText(assignedTaskEmailNotificationTitle),
        getNewlines(2),
        `You have been assigned to a task in ${props.senderOrg} by ${props.assigner}.`,
        getNewlines(2),
    ];

    if (props.taskName || props.taskDescription) {
        textBlocks.push(
            `Task:`,
            getNewlines(),
            props.taskName || props.taskDescription,
            getNewlines(2)
        );
    }

    if (props.taskName && props.taskDescription) {
        textBlocks.push(
            `Description:`,
            getNewlines(),
            props.taskDescription,
            getNewlines(2)
        );
    }

    textBlocks.push(
        `To view the assigned task, login to your account here - `,
        getNewlines(),
        `${props.loginLink}.`,
        getNewlines(2),
        getEndGreeting()
    );

    return textBlocks.join("");
}
