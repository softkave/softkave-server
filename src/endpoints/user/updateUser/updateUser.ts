import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { IUserUpdatePacket, OutgoingSocketEvents } from "../../socket/server";
import { UpdateUserEndpoint } from "./types";
import { updateUserJoiSchema } from "./validation";

const updateUser: UpdateUserEndpoint = async (context, instData) => {
  const data = validate(instData.data, updateUserJoiSchema);
  const user = await context.session.getUser(context.models, instData);

  if (data.notificationsLastCheckedAt) {
    const broadcastData: IUserUpdatePacket = {
      notificationsLastCheckedAt: getDateString(
        data.notificationsLastCheckedAt
      ),
    };

    context.room.broadcastToUserClients(
      context.socketServer,
      user.customId,
      OutgoingSocketEvents.UserUpdate,
      broadcastData,
      instData.socket
    );
  }

  await context.session.updateUser(context.models, instData, data);
};

export default updateUser;
