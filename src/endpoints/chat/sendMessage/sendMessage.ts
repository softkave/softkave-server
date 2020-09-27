import { IRoom } from "../../../mongo/room";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    NoRoomOrRecipientProvidedError,
    RoomDoesNotExistError,
} from "../errors";
import { SendMessageEndpoint } from "./type";
import { sendMessageJoiSchema } from "./validation";

const sendMessage: SendMessageEndpoint = async (context, instaData) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);
    const data = validate(instaData.data, sendMessageJoiSchema);
    const org = await context.block.getBlockById(context, data.orgId);

    canReadBlock({ user, block: org });

    // TODO: how can we eliminate OR make this part faster?
    // We could generate a token after the first message to signify that the checks are passed
    let room: IRoom;

    if (data.roomId) {
        room = await context.chat.getRoomById(context, data.roomId);
    } else if (data.recipientId) {
        room = await context.chat.insertRoom(
            context,
            data.orgId,
            user.customId,
            context.room.getNewRoomId(),
            [data.recipientId]
        );
    } else {
        throw new NoRoomOrRecipientProvidedError();
    }

    if (!room) {
        throw new RoomDoesNotExistError();
    }

    // TODO: We could make the members a map, for optimization where there are many members
    // in a room
    const isUserInRoom =
        context.room.isUserInRoom(context, room.name, user.customId) ||
        !!room.members.find((member) => member.userId === user.customId);

    if (!isUserInRoom) {
        await context.chat.addMemberToRoom(
            context,
            room.customId,
            user.customId
        );
        context.room.subscribeUser(context, room.name, user.customId);
    }

    const chat = await context.chat.insertMessage(
        context,
        data.orgId,
        user.customId,
        room.customId,
        data.message
    );

    return chat;
};

export default sendMessage;
