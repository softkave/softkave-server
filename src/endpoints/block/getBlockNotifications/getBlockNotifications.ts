import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { GetBlockNotificationsEndpoint } from "./types";
import { getBlockCollaborationRequestsJoiSchema } from "./validation";

const getBlockNotifications: GetBlockNotificationsEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, getBlockCollaborationRequestsJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.customId);

  await canReadBlock({ user, block });

  const requests = await context.notification.getNotificationsByBlockId(
    context.models,
    block.customId
  );

  return {
    notifications: requests,
  };
};

export default getBlockNotifications;
