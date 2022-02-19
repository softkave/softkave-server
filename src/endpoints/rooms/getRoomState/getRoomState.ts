import { SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { checkBlockAccess } from "../../block/checkBlockAccess";
import { RoomDoesNotExistError } from "../../chat/errors";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import { subscribeJoiSchema } from "../subscribe/validation";
import { GetRoomStateEndpoint } from "./types";

const getRoomState: GetRoomStateEndpoint = async (context, instData) => {
    const data = validate(instData.data, subscribeJoiSchema);
    const user = await context.session.getUser(context, instData);
    const promises = data.rooms.map(async (item) => {
        switch (item.type) {
            case SystemResourceType.Organization: {
                const block = await checkBlockAccess(
                    context,
                    item.customId,
                    user
                );

                const roomName = SocketRoomNameHelpers.getOrganizationRoomName(
                    block.customId
                );

                return context.socketRooms.getRoom(roomName);
            }

            case SystemResourceType.Board: {
                const block = await checkBlockAccess(
                    context,
                    item.customId,
                    user
                );

                const baordRoomName = SocketRoomNameHelpers.getBoardRoomName(
                    block.customId
                );

                if (item.subRoom === SystemResourceType.Task) {
                    const roomName =
                        SocketRoomNameHelpers.getBoardTasksRoomName(
                            block.customId
                        );

                    return context.socketRooms.getRoom(roomName);
                } else if (item.subRoom === SystemResourceType.Sprint) {
                    const roomName =
                        SocketRoomNameHelpers.getBoardSprintsRoomName(
                            block.customId
                        );

                    return context.socketRooms.getRoom(roomName);
                } else {
                    return context.socketRooms.getRoom(baordRoomName);
                }
            }

            case SystemResourceType.Room: {
                const room = await context.chat.getRoomById(
                    context,
                    item.customId
                );

                if (!room) {
                    throw new RoomDoesNotExistError();
                }

                const organization = await context.block.getBlockById(
                    context,
                    room.orgId
                );

                assertBlock(organization);
                canReadBlock({ user, block: organization });
                const isUserInRoom = !!room.members.find(
                    (member) => member.userId === user.customId
                );

                if (isUserInRoom) {
                    return context.socketRooms.getRoom(
                        SocketRoomNameHelpers.getChatRoomName(room.customId)
                    );
                }

                break;
            }
        }
    });

    const rooms = await Promise.all(promises);
    return { rooms };
};

export default getRoomState;
