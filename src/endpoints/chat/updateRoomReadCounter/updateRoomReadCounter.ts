import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { UpdateRoomReadCounterEndpoint } from "./type";
import { getRoomsJoiSchema } from "./validation";

const updateRoomReadCounter: UpdateRoomReadCounterEndpoint = async (
    context,
    instaData
) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);
    const data = validate(instaData.data, getRoomsJoiSchema);
    const org = await context.block.getBlockById(context, data.orgId);

    canReadBlock({ user, block: org });

    await context.chat.updateMemberReadCounter(
        context,
        data.roomId,
        user.customId,
        data.readCounter
    );
};

export default updateRoomReadCounter;
