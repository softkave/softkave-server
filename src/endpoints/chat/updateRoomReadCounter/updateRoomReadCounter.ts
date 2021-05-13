import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
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

    assertBlock(org);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         orgId: getBlockRootBlockId(org),
    //         resourceType: SystemResourceType.Chat,
    //         action: SystemActionType.Read,
    //         permissionResourceId: org.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: org });

    const currentRoomMemberData = await context.chat.getUserRoomReadCounter(
        context,
        user.customId,
        data.roomId
    );

    if (!currentRoomMemberData) {
        throw new Error();
    }

    const inputReadCounter = data.readCounter
        ? data.readCounter > Date.now()
            ? Date.now()
            : data.readCounter
        : Date.now();

    const readCounter = getDateString(inputReadCounter);

    await context.chat.updateMemberReadCounter(
        context,
        data.roomId,
        user.customId,
        readCounter
    );

    context.broadcastHelpers.broadcastRoomReadCounterUpdate(
        context,
        instaData,
        user,
        data.roomId,
        readCounter
    );

    return { readCounter };
};

export default updateRoomReadCounter;
