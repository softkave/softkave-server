import { SystemActionType, SystemResourceType } from "../../../mongo/audit-log";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import canReadNote from "../canReadNote";
import { DeleteNoteEndpoint } from "./types";
import { deleteNoteJoiSchema } from "./validation";

const deleteNote: DeleteNoteEndpoint = async (context, instData) => {
    const data = validate(instData.data, deleteNoteJoiSchema);
    const user = await context.session.getUser(context, instData);
    const note = await context.note.getNoteById(context, data.noteId);
    const block = await context.block.getBlockById(context, note.blockId);

    canReadBlock({ user, block });
    canReadNote({ user, block, note });
    await context.note.markNoteDeleted(context, note.customId, user);

    context.auditLog.insert(context, instData, {
        action: SystemActionType.Delete,
        resourceId: note.customId,
        resourceType: SystemResourceType.Note,
        organizationId: getBlockRootBlockId(block),
        resourceOwnerId: block.customId,
    });
};

export default deleteNote;
