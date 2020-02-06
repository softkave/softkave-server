import { IUpdateCollaborationRequestContext } from "./types";
import { validate } from "utils/joiUtils";
import { updateCollaborationRequestSchema } from "./validation";
import notificationError from "utils/notificationError";

async function updateCollaborationRequest(
  context: IUpdateCollaborationRequestContext
): Promise<any> {
  const result = validate(context.data, updateCollaborationRequestSchema);

  const customId = result.customId;
  const email = context.data.user.email;
  const data = result.data;

  const notification = await context.getUserNotificationAndUpdate(
    customId,
    email,
    data
  );

  if (!!!notification) {
    throw new notificationError.requestDoesNotExist();
  }
}
