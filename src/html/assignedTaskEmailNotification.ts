import {
  getFooterHTML,
  getHeaderHTML,
  getHeaderText,
  getTemplateStylesHTML,
} from "./helpers";

export const assignedTaskEmailNotificationTitle = "Assigned Task Notification";

export interface IAssignedTaskEmailNotificationProps {
  assignee: string;
  assigner: string;
  senderOrg: string;
  loginLink: string;
  taskDescription: string;
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
      <header class="email-header">
        <h1>${getHeaderHTML(assignedTaskEmailNotificationTitle)}</h1>
      </header>
      <div class="email-body">
        <div class="email-content-center">
          <p>
            You have been assigned to a task on <b>${
              props.senderOrg
            }</b> by <b>${props.assigner}</b>.
          </p>
          <p>
            <b>Task Description</b><br />
            ${props.taskDescription}
          </p>
          <p>
            To view the assigned task,
            <a href="${props.loginLink}">Login to your account here</a>.
          </p>
          <hr>
          <p class="email-header">
            If you are not ${props.assignee}. Please, ignore this mail
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
    `${getHeaderText(assignedTaskEmailNotificationTitle)}`,
    `\n\nYou have been assigned to a task on ${props.senderOrg} by ${props.assigner}.`,
    `\n\nTo view the assigned task, login to your account using ${props.loginLink}.`,
    `\n\nThen, open the app menu, goto Notifications.`,
    `If you are not ${props.assignee}. Please, ignore this mail`,
  ];

  textBlocks.join("");
}
