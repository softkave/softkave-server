import { validate } from "../../../utilities/joiUtils";
import { getPublicRoomsArray } from "../utils";
import { GetRoomsEndpoint } from "./type";
import { getRoomsJoiSchema } from "./validation";

const getRooms: GetRoomsEndpoint = async (context, instData) => {
  const data = validate(instData.data, getRoomsJoiSchema);
  const user = await context.session.getUser(context, instData);
  context.socket.assertSocket(instData);
  const rooms = await context.chat.getRooms(context, user.customId, [
    data.orgId,
  ]);

  const publicRoomsData = getPublicRoomsArray(rooms);
  return {
    rooms: publicRoomsData,
  };
};

export default getRooms;
