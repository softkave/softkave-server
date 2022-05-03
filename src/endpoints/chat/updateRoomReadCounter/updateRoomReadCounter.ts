import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { getPublicRoomData } from "../utils";
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
    const room = await context.chat.updateMemberReadCounter(
        context,
        data.roomId,
        user.customId,
        readCounter
    );

    const roomData = getPublicRoomData(room);
    outgoingEventFn(
        context,
        SocketRoomNameHelpers.getUserRoomName(user.customId),
        {
            actionType: SystemActionType.Update,
            resourceType: SystemResourceType.Room,
            resource: roomData,
        }
    );

    return { readCounter, room: roomData };
};

export default updateRoomReadCounter;
