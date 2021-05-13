import { IRoom } from "../../../mongo/room";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { IBaseContext } from "../../contexts/BaseContext";
import { IBroadcastResult } from "../../contexts/RoomContext";
import { fireAndForgetPromise } from "../../utils";
import {
    NoRoomOrRecipientProvidedError,
    RoomDoesNotExistError,
} from "../errors";
import { getPublicChatData } from "../utils";
import { SendMessageEndpoint } from "./type";
import { sendMessageJoiSchema } from "./validation";

async function sendPushNotification(
    context: IBaseContext,
    userId: string,
    roomId: string,
    broadcastResultPromise: Promise<IBroadcastResult>
) {
    const broadcastResult = await broadcastResultPromise;

    if (broadcastResult.broadcastsCount > 0) {
        return;
    }

    // TODO: what happens when the user gets another message in the same room
    // while the current one is processing
    const unseenChats = await context.unseenChats.addEntry(
        context,
        userId,
        roomId
    );

    const { roomsCount, chatsCount } =
        context.unseenChats.sumUnseenChatsAndRooms(context, unseenChats);

    const clients = await context.client.getPushSubscribedClients(
        context,
        userId
    );

    if (clients.length === 0) {
        return;
    }

    // TODO: exclude clients with chat notifications muted
    const subscriptions =
        await context.pushSubscription.getPushSubscriptionsByUserId(
            context,
            userId,
            clients.map((client) => client.clientId)
        );

    const message = `${chatsCount} messages from ${roomsCount}`;
    subscriptions.forEach((subscription) => {
        fireAndForgetPromise(
            context.webPush.sendNotification(subscription, message)
        );
    });
}

const sendMessage: SendMessageEndpoint = async (context, instaData) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);
    const data = validate(instaData.data, sendMessageJoiSchema);
    const org = await context.block.assertGetBlockById(context, data.orgId);

    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         orgId: getBlockRootBlockId(org),
    //         resourceType: SystemResourceType.Chat,
    //         action: SystemActionType.Create,
    //         permissionResourceId: org.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: org });

    // TODO: how can we eliminate OR make the room fetching faster?
    let room: IRoom;

    if (data.roomId) {
        // TODO: maybe leave out the readCounters when getting the rooms
        room = await context.chat.getRoomById(context, data.roomId);
    } else if (data.recipientId) {
        room = await context.chat.insertRoom(
            context,
            data.orgId,
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
        data.orgId,
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

    fireAndForgetPromise(
        sendPushNotification(
            context,
            user.customId,
            data.roomId,
            broadcastResultPromise
        )
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
