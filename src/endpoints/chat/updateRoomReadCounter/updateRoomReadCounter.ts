import { assertBlock } from "../../../mongo/block/utils";
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
    const organization = await context.block.getBlockById(context, data.orgId);

    assertBlock(organization);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(organization),
    //         resourceType: SystemResourceType.Chat,
    //         action: SystemActionType.Read,
    //         permissionResourceId: organization.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: organization });

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
