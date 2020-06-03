import { validate } from "../../../utilities/joiUtils";
import { PermissionDeniedError } from "../../errors";
import { NotificationDoesNotExistError } from "../../notification/errors";
import { MarkNotificationReadEndpoint } from "./types";
import { updateCollaborationRequestSchema } from "./validation";

const markNotificationRead: MarkNotificationReadEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, updateCollaborationRequestSchema);
  const user = await context.session.getUser(context.models, instData);
  const notification = await context.notification.getNotificationById(
    context.models,
    data.notificationId
  );

  if (!notification) {
    throw new NotificationDoesNotExistError();
  }

  if (notification.to.email !== user.email) {
    throw new PermissionDeniedError();
  }

  await context.notification.updateNotificationById(
    context.models,
    data.notificationId,
    { readAt: data.readAt as any }
  );
};

export default markNotificationRead;
