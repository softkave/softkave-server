import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
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

    const currentRoomMemberData = await context.chat.getUserRoomReadCounter(
        context,
        user.customId,
        data.roomId
    );

    if (!currentRoomMemberData) {
        throw new Error();
    }

    const readCounter = getDateString(data.readCounter);

    await context.chat.updateMemberReadCounter(
        context,
        data.roomId,
        user.customId,
        readCounter
    );

    context.broadcastHelpers.broadcastRoomReadCounterUpdate(
        context,
        user,
        data.roomId,
        readCounter,
        instaData
    );

    return { readCounter };
};

export default updateRoomReadCounter;
