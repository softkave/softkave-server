import { SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { checkBlockAccess } from "../../block/checkBlockAccess";
import { RoomDoesNotExistError } from "../../chat/errors";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import { SubscribeEndpoint } from "./types";
import { subscribeJoiSchema } from "./validation";

const subscribe: SubscribeEndpoint = async (context, instData) => {
    const data = validate(instData.data, subscribeJoiSchema);
    const user = await context.session.getUser(context, instData);
    const socket = context.socket.assertGetSocket(instData);
    const promises = data.rooms.map(async (item) => {
        switch (item.type) {
            case SystemResourceType.Organization: {
                // TODO: can we batch fetch the resources, rather
                // than querying one at a time?
                // same for other room endpoints  that follow the same pattern.
                const block = await checkBlockAccess(
                    context,
                    item.customId,
                    user
                );

                const roomName = SocketRoomNameHelpers.getOrganizationRoomName(
                    block.customId
                );
                context.socketRooms.addToRoom(roomName, socket.id);
                return;
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

                    context.socketRooms.addToRoom(roomName, socket.id, {
                        useSocketIdsFromRoom: baordRoomName,
                    });
                } else if (item.subRoom === SystemResourceType.Sprint) {
                    const roomName =
                        SocketRoomNameHelpers.getBoardSprintsRoomName(
                            block.customId
                        );

                    context.socketRooms.addToRoom(roomName, socket.id, {
                        useSocketIdsFromRoom: baordRoomName,
                    });
                } else {
                    context.socketRooms.addToRoom(baordRoomName, socket.id);
                }

                return;
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

                // if (!isUserInRoom) {
                //     await context.chat.addMemberToRoom(
                //         context,
                //         room.customId,
                //         user.customId
                //     );
                // }

                if (isUserInRoom) {
                    context.socketRooms.addToRoom(
                        SocketRoomNameHelpers.getChatRoomName(room.customId),
                        socket.id
                    );
                }

                return;
            }
        }
    });

    // TODO: can we return individual errors, not combined or the first to occur?
    // same for other room endpoints
    await Promise.all(promises);
};

export default subscribe;
