import { notImplementFn } from "../endpoints/testUtils/utils";

export const assignedTaskEmailNotificationTitle =
  "You have newly assigned tasks";

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
  notImplementFn();
  return "";
}

export function assignedTaskEmailNotificationText(
  props: IAssignedTaskEmailNotificationProps
) {
  notImplementFn();
  return "";
}
