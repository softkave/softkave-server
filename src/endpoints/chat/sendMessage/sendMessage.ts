import { IRoom } from "../../../mongo/room";
import { IUser } from "../../../mongo/user";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { IBaseContext } from "../../contexts/BaseContext";
import { IBroadcastResult } from "../../contexts/RoomContext";
import { fireAndForgetFn, fireAndForgetPromise } from "../../utils";
import {
    NoRoomOrRecipientProvidedError,
    RoomDoesNotExistError,
} from "../errors";
import { getPublicChatData, sumUnseenChatsAndRooms } from "../utils";
import { SendMessageEndpoint } from "./type";
import { sendMessageJoiSchema } from "./validation";

async function sendPushNotification(
    context: IBaseContext,
    sender: IUser,
    room: IRoom,
    broadcastResultPromise: Promise<IBroadcastResult>
) {
    const broadcastResult = await broadcastResultPromise;
    const members = room.members;
    const activeUsersMap = broadcastResult.endpoints.reduce(
        (map, endpoint) => {
            if (!endpoint.entry.isInactive) {
                map[endpoint.entry.userId] = true;
            }

            return map;
        },
        { [sender.customId]: true } as Record<string, boolean>
    );

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
                context.webPush.sendNotification(
                    context,
                    endpoint,
                    keys,
                    message
                )
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
        data.organizationId
    );

    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(organization),
    //         resourceType: SystemResourceType.Chat,
    //         action: SystemActionType.Create,
    //         permissionResourceId: organization.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: organization });

    // TODO: how can we eliminate OR make the room fetching faster?
    let room: IRoom;

    if (data.roomId) {
        // TODO: maybe leave out the readCounters when getting the rooms
        room = await context.chat.getRoomById(context, data.roomId);
    } else if (data.recipientId) {
        room = await context.chat.insertRoom(
            context,
            data.organizationId,
            user.customId,
            null,
            [data.recipientId]
        );
    } else {
        throw new NoRoomOrRecipientProvidedError();
    }

    if (!room) {
        throw new RoomDoesNotExistError();
    }

    if (data.recipientId && !data.roomId) {
        // It's a new room/chat
        context.room.subscribeUser(context, room.name, user.customId);
        context.room.subscribeUser(context, room.name, data.recipientId);
        context.broadcastHelpers.broadcastNewRoom(context, instaData, room);
    }

    const chat = await context.chat.insertMessage(
        context,
        data.organizationId,
        user.customId,
        room.customId,
        data.message
    );

    const broadcastResultPromise = context.broadcastHelpers.broadcastNewMessage(
        context,
        instaData,
        room,
        chat
    );

    // TODO: implement a scheduler that can run a task after a task is completed

    // TODO: our fire and forganizationets are running immediately
    // go through them and update the ones you want to run
    // after the main request is done
    fireAndForgetFn(() =>
        sendPushNotification(context, user, room, broadcastResultPromise)
    );

    if (data.roomId) {
        const readCounter = getDateString();
        await context.chat.updateMemberReadCounter(
            context,
            data.roomId,
            user.customId
        );

        context.broadcastHelpers.broadcastRoomReadCounterUpdate(
            context,
            instaData,
            user,
            room.customId,
            readCounter
        );
    }

    return { chat: getPublicChatData(chat) };
};

export default sendMessage;
