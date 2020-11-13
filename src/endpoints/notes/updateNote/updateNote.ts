import pick from "lodash/pick";
import {
    AuditLogActionType,
    AuditLogResourceType,
} from "../../../mongo/audit-log";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import canReadNote from "../canReadNote";
import { UpdateNoteEndpoint } from "./types";
import { updateNoteJoiSchema } from "./validation";

const updateNote: UpdateNoteEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateNoteJoiSchema);
    const updateData = data.data;
    const user = await context.session.getUser(context, instData);
    const note = await context.note.getNoteById(context, data.noteId);
    const block = await context.block.getBlockById(context, note.blockId);

    canReadBlock({ user, block });
    canReadNote({ user, block, note });

    const updatedNote = await context.note.updateNoteById(
        context,
        data.noteId,
        {
            ...updateData,
            updatedAt: getDate(),
            updatedBy: user.customId,
        }
    );

    context.auditLog.insert(context, instData, {
        action: AuditLogActionType.Update,
        resourceId: note.customId,
        resourceType: AuditLogResourceType.Note,
        change: {
            oldValue: pick(note, Object.keys(data.data)),
            newValue: data.data,
            customId: getNewId(),
        },
        resourceOwnerId: block.customId,
        organizationId: getBlockRootBlockId(block),
    });

    return {
        note: updatedNote,
    };
};

export default updateNote;
