import { validate } from "../../../utilities/joiUtils";
import { isUserPartOfRoom } from "../utils";
import { GetRoomsUnseenChatsCountEndpoint } from "./type";
import { getRoomsUnseenChatsCountJoiSchema } from "./validation";

const getRoomsUnseenChatsCount: GetRoomsUnseenChatsCountEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, getRoomsUnseenChatsCountJoiSchema);
  const user = await context.session.getUser(context, instData);
  context.socket.assertSocket(instData);
  const rooms = (
    await context.chat.getRoomsByIds(context, data.orgId, data.roomIds)
  ).filter((room) => isUserPartOfRoom(room, user.customId));
  const counts = (
    await Promise.all(
      rooms.map((room) =>
        context.chat.getRoomChatsCount(context, room.customId)
      )
    )
  ).map((count, index) => ({ count, roomId: data.roomIds[index] }));
  return { counts };
};

export default getRoomsUnseenChatsCount;
