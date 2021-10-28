import { SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
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
            case SystemResourceType.Organization:
            case SystemResourceType.Board: {
                const block = await context.block.getBlockById(
                    context,
                    dt.customId
                );

                assertBlock(block);
                // await context.accessControl.assertPermission(
                //     context,
                //     {
                //         organizationId: getBlockRootBlockId(block),
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

                const organization = await context.block.getBlockById(
                    context,
                    room.orgId
                );

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
