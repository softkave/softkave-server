import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import {
    IOutgoingUpdateRoomReadCounterPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { UpdateRoomReadCounterEndpoint } from "./type";
import { updateRoomReadCounterJoiSchema } from "./validation";

const updateRoomReadCounter: UpdateRoomReadCounterEndpoint = async (
    context,
    instaData
) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);
    const data = validate(instaData.data, updateRoomReadCounterJoiSchema);
    const org = await context.block.getBlockById(context, data.orgId);

    canReadBlock({ user, block: org });

    const readCounter = data.readCounter || getDateString();

    await context.chat.updateMemberReadCounter(
        context,
        data.roomId,
        user.customId,
        readCounter
    );

    const roomSignature = context.room.getChatRoomName(data.roomId);
    const outgoingUpdateRoomCounterPacket: IOutgoingUpdateRoomReadCounterPacket = {
        member: { readCounter, userId: user.customId },
        roomId: data.roomId,
    };

    await context.room.broadcast(
        context,
        roomSignature,
        OutgoingSocketEvents.UpdateRoomReadCounter,
        outgoingUpdateRoomCounterPacket,
        instaData
    );
};

export default updateRoomReadCounter;
