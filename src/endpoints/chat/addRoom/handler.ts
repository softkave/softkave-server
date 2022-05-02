import { SystemActionType, SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import { IBaseContext } from "../../contexts/IBaseContext";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import canReadOrganization from "../../organization/canReadBlock";
import { OrganizationDoesNotExistError } from "../../organization/errors";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { getPublicRoomData } from "../utils";
import { AddRoomEndpoint } from "./types";
import { addRoomJoiSchema } from "./validation";

const addRoom: AddRoomEndpoint = async (context, instData) => {
  const data = validate(instData.data, addRoomJoiSchema);
  const user = await context.session.getUser(context, instData);
  await context.block.assertBlockById(context, data.orgId, () => {
    throw new OrganizationDoesNotExistError();
  });

  canReadOrganization(data.orgId, user);
  let room = await context.chat.getRoomByRecipientId(
    context,
    data.orgId,
    data.recipientId
  );

  if (!room) {
    room = await context.chat.insertRoom(
      context,
      data.orgId,
      user.customId,
      null,
      [data.recipientId]
    );
    addUserToRoom(context, room.name, user.customId);
    addUserToRoom(context, room.name, data.recipientId);
    outgoingEventFn(
      context,
      SocketRoomNameHelpers.getUserRoomName(data.recipientId),
      {
        actionType: SystemActionType.Create,
        resourceType: SystemResourceType.Room,
        resource: getPublicRoomData(room),
      }
    );
  }

  return { room: getPublicRoomData(room) };
};

function addUserToRoom(ctx: IBaseContext, roomName: string, userId: string) {
  const userRoom = ctx.socketRooms.getRoom(
    SocketRoomNameHelpers.getUserRoomName(userId)
  );

  if (!userRoom) {
    return;
  }

  Object.keys(userRoom.socketIds).forEach((id) =>
    ctx.socketRooms.addToRoom(roomName, id)
  );
}

export default addRoom;
