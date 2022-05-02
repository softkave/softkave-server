import assert from "assert";
import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IRoom } from "../../../mongo/room";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { IBaseContext } from "../../contexts/IBaseContext";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { fireAndForgetFn, fireAndForgetPromise } from "../../utils";
import { RoomDoesNotExistError } from "../errors";
import {
  getPublicChatData,
  getPublicRoomData,
  sumUnseenChatsAndRooms,
} from "../utils";
import { SendMessageEndpoint } from "./type";
import { sendMessageJoiSchema } from "./validation";

async function sendPushNotification(
  context: IBaseContext,
  sender: IUser,
  room: IRoom
) {
  const members = room.members;
  const socketRoom = context.socketRooms.getRoom(
    SocketRoomNameHelpers.getChatRoomName(room.customId)
  );

  if (!socketRoom) {
    return;
  }

  const activeUsersMap: Record<string, boolean> = { [sender.customId]: true };
  Object.keys(socketRoom.socketIds).forEach((id) => {
    const socket = context.socketMap.getSocket(id);

    if (socket && socket.isActive) {
      activeUsersMap[socket.userId] = true;
    }
  });

  const inactiveMemberIds = members
    .filter((member) => !activeUsersMap[member.userId])
    .map((member) => member.userId);

  inactiveMemberIds.forEach(async (userId) => {
    // TODO: what happens when the user gets another message in the same room
    // while the current one is processing

    // TODO: maybe only log the unseen chats
    // then lock ( still accept updates but only send the current amount )
    // and send in intervals
    const unseenChats = await context.unseenChats.addEntry(
      context,
      userId,
      room.customId
    );

    // TODO: chats count is flaky and sometimes, inactiveSockets count is flaky
    const { roomsCount, chatsCount } = sumUnseenChatsAndRooms(unseenChats);
    const clients = await context.client.getPushSubscribedClients(
      context,
      userId
    );

    if (clients.length === 0) {
      return;
    }

    const message = `You have ${chatsCount} ${
      chatsCount === 1 ? "message" : "messages"
    } from ${roomsCount} ${roomsCount === 1 ? "chat" : "chats"}`;

    clients.forEach((client) => {
      const endpoint = client.endpoint!;
      const keys = client.keys!;
      fireAndForgetPromise(
        context.webPush.sendNotification(context, endpoint, keys, message)
      );
    });
  });
}

const sendMessage: SendMessageEndpoint = async (context, instaData) => {
  const user = await context.session.getUser(context, instaData);
  context.socket.assertSocket(instaData);
  const data = validate(instaData.data, sendMessageJoiSchema);
  const organization = await context.block.assertGetBlockById(
    context,
    data.orgId
  );
  canReadBlock({ user, block: organization });
  let room = await context.chat.getRoomById(context, data.roomId);
  assert(room, new RoomDoesNotExistError());
  const chat = await context.chat.insertMessage(
    context,
    data.orgId,
    user.customId,
    room.customId,
    data.message
  );
  room = await context.chat.updateRoom(context, room.customId, {
    lastChatCreatedAt: chat.createdAt,
    members: room.members.map((member) => {
      if (member.userId === user.customId) {
        return {
          ...member,
          readCounter: getDate(),
        };
      }

      return member;
    }),
    updatedAt: getDate(),
    updatedBy: user.customId,
  });
  const roomData = getPublicRoomData(room);
  const chatData = getPublicChatData(chat);
  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getChatRoomName(room.customId),
    {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.Room,
      resource: roomData,
    }
  );
  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getChatRoomName(room.customId),
    {
      actionType: SystemActionType.Create,
      resourceType: SystemResourceType.Chat,
      resource: chatData,
    }
  );

  // TODO: implement a scheduler that can run a task after a task is completed
  // TODO: our fire and forget are running immediately
  // go through them and update the ones you want to run
  // after the main request is done
  fireAndForgetFn(() => sendPushNotification(context, user, room));
  return { chat: getPublicChatData(chat) };
};

export default sendMessage;
