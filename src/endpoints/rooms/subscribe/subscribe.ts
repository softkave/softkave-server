import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import { RoomDoesNotExistError } from "../../chat/errors";
import { SubscribeEndpoint } from "./types";
import { subscribeJoiSchema } from "./validation";

const subscribe: SubscribeEndpoint = async (context, instData) => {
    const data = validate(instData.data, subscribeJoiSchema);
    const user = await context.session.getUser(context, instData);

    context.socket.assertSocket(instData);

    // TODO: how many rooms should we allow a user to subscribe to per time

    const promises = data.items.map(async (dt) => {
        switch (dt.type) {
            case SystemResourceType.Org:
            case SystemResourceType.Board: {
                const block = await context.block.getBlockById(
                    context,
                    dt.customId
                );

                assertBlock(block);
                // await context.accessControl.assertPermission(
                //     context,
                //     {
                //         orgId: getBlockRootBlockId(block),
                //         resourceType: getBlockAuditLogResourceType(block),
                //         action: SystemActionType.Read,
                //         permissionResourceId: block.permissionResourceId,
                //     },
                //     user
                // );

                canReadBlock({ user, block });

                const roomName = context.room.getBlockRoomName(
                    block.type,
                    block.customId
                );

                context.room.subscribe(instData, roomName);
                break;
            }

            case SystemResourceType.Room: {
                const room = await context.chat.getRoomById(
                    context,
                    dt.customId
                );

                if (!room) {
                    throw new RoomDoesNotExistError();
                }

                const org = await context.block.getBlockById(
                    context,
                    room.orgId
                );

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

                const isUserInRoom = !!room.members.find(
                    (member) => member.userId === user.customId
                );

                if (!isUserInRoom) {
                    await context.chat.addMemberToRoom(
                        context,
                        room.customId,
                        user.customId
                    );
                }

                context.room.subscribeUser(context, room.name, user.customId);
                break;
            }
        }
    });

    // TODO: can we return individual errors, not combined or the first to occur?
    // same for unsubscribe
    await Promise.all(promises);
};

export default subscribe;
