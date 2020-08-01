import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { GetBlockNotificationsEndpoint } from "./types";
import { getBlockCollaborationRequestsJoiSchema } from "./validation";

const getBlockNotifications: GetBlockNotificationsEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, getBlockCollaborationRequestsJoiSchema);
  const user = await context.session.getUser(context, instData);
  const block = await context.block.getBlockById(context, data.blockId);

  await canReadBlock({ user, block });

  const requests = await context.notification.getNotificationsByBlockId(
    context,
    block.customId
  );

  return {
    notifications: requests,
  };
};

export default getBlockNotifications;
