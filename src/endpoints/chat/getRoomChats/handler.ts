import assert from "assert";
import { validate } from "../../../utilities/joiUtils";
import { RoomDoesNotExistError } from "../errors";
import { getPublicChatsArray, isUserPartOfRoom } from "../utils";
import { GetRoomChatsEndpoint } from "./type";
import { getRoomChatsJoiSchema } from "./validation";

const getRoomChats: GetRoomChatsEndpoint = async (context, instData) => {
  const data = validate(instData.data, getRoomChatsJoiSchema);
  const user = await context.session.getUser(context, instData);
  context.socket.assertSocket(instData);
  const room = await context.chat.getRoomById(context, data.roomId);
  assert(room, new RoomDoesNotExistError());
  assert(isUserPartOfRoom(room, user.customId), "User is not part of room");
  const chats = await context.chat.getMessages(context, [room.customId]);
  const publicChatsData = getPublicChatsArray(chats);
  return {
    chats: publicChatsData,
  };
};

export default getRoomChats;
