import { validate } from "../../../utilities/joiUtils";
import { OutgoingSocketEvents } from "../../socket/server";
import { UpdateUserEndpoint } from "./types";
import { updateUserJoiSchema } from "./validation";

const updateUser: UpdateUserEndpoint = async (context, instData) => {
  const data = validate(instData.data, updateUserJoiSchema);
  const user = await context.session.getUser(context.models, instData);

  if (data.notificationsLastCheckedAt) {
    context.room.broadcastToUserClients(
      context.socketServer,
      user.customId,
      OutgoingSocketEvents.UserUpdate,
      { notificationsLastCheckedAt: data.notificationsLastCheckedAt },
      instData.socket
    );
  }

  await context.session.updateUser(context.models, instData, data);
};

export default updateUser;
