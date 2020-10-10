import { AuditLogResourceType } from "../../../mongo/audit-log";
import { validate } from "../../../utilities/joiUtils";
import { SubscribeEndpoint } from "../subscribe/types";
import { subscribeJoiSchema } from "../subscribe/validation";

const unsubscribe: SubscribeEndpoint = async (context, instData) => {
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
                const roomName = context.room.getBlockRoomName(block);
                context.room.leave(instData, roomName);
                break;
            }

            case AuditLogResourceType.Note: {
                const note = await context.note.getNoteById(
                    context,
                    dt.customId
                );
                const roomName = context.room.getNoteRoomName(note);
                context.room.leave(instData, roomName);
                break;
            }

            case AuditLogResourceType.Room: {
                const room = await context.chat.getRoomById(
                    context,
                    dt.customId
                );
                context.room.unSubscribeUser(context, room.name, user.customId);
                break;
            }
        }
    });

    await Promise.all(prs);
};

export default unsubscribe;
