import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { IRoom } from "../../../mongo/room";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import {
    NoRoomOrRecipientProvidedError,
    RoomDoesNotExistError,
} from "../errors";
import { getPublicChatData } from "../utils";
import { SendMessageEndpoint } from "./type";
import { sendMessageJoiSchema } from "./validation";

const sendMessage: SendMessageEndpoint = async (context, instaData) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);
    const data = validate(instaData.data, sendMessageJoiSchema);
    const org = await context.block.getBlockById(context, data.orgId);

    assertBlock(org);
    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(org),
            resourceType: SystemResourceType.Chat,
            action: SystemActionType.Create,
            permissionResourceId: org.permissionResourceId,
        },
        user
    );

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
        context.broadcastHelpers.broadcastNewRoom(context, room);
    }

    const chat = await context.chat.insertMessage(
        context,
        data.orgId,
        user.customId,
        room.customId,
        data.message
    );

    context.broadcastHelpers.broadcastNewMessage(
        context,
        room,
        chat,
        instaData
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
            user,
            room.customId,
            readCounter,
            instaData
        );
    }

    return { chat: getPublicChatData(chat) };
};

export default sendMessage;
