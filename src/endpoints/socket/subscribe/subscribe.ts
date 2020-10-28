import { AuditLogResourceType } from "../../../mongo/audit-log";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { BlockDoesNotExistError } from "../../block/errors";
import { RoomDoesNotExistError } from "../../chat/errors";
import { NoteDoesNotExistError } from "../../note/errors";
import { SubscribeEndpoint } from "./types";
import { subscribeJoiSchema } from "./validation";

const subscribe: SubscribeEndpoint = async (context, instData) => {
    const data = validate(instData.data, subscribeJoiSchema);
    const user = await context.session.getUser(context, instData);
    context.socket.assertSocket(instData);

    const prs = data.items.map(async (dt) => {
        switch (dt.type) {
            case AuditLogResourceType.Org:
            case AuditLogResourceType.Board: {
                const block = await context.block.getBlockById(
                    context,
                    dt.customId
                );

                if (!block) {
                    throw new BlockDoesNotExistError();
                }

                canReadBlock({ user, block });

                const roomName = context.room.getBlockRoomName(
                    block.type,
                    block.customId
                );

                context.room.subscribe(instData, roomName);
                break;
            }

            case AuditLogResourceType.Note: {
                const note = await context.note.getNoteById(
                    context,
                    dt.customId
                );

                if (!note) {
                    throw new NoteDoesNotExistError();
                }

                const parentBlock = await context.block.getBlockById(
                    context,
                    note.blockId
                );
                canReadBlock({ user, block: parentBlock });

                const roomName = context.room.getNoteRoomName(note);
                context.room.subscribe(instData, roomName);
                break;
            }

            case AuditLogResourceType.Room: {
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
    await Promise.all(prs);
};

export default subscribe;
