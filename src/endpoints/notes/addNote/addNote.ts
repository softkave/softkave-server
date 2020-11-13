import {
    AuditLogActionType,
    AuditLogResourceType,
} from "../../../mongo/audit-log";
import { INote } from "../../../mongo/note";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import { NoteExistsError } from "../errors";
import { AddNoteEndpoint } from "./types";
import { addNoteJoiSchema } from "./validation";

const addNote: AddNoteEndpoint = async (context, instData) => {
    const data = validate(instData.data.note, addNoteJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    await canReadBlock({ user, block });

    const noteExists = await context.note.noteExists(
        context,
        data.name,
        data.blockId
    );

    if (noteExists) {
        throw new NoteExistsError({ blockType: block.type, name: data.name });
    }

    const now = getDate();
    const note: INote = {
        customId: data.customId,
        blockId: data.blockId,
        body: data.body,
        createdAt: now,
        createdBy: user.customId,
        color: data.color,
        name: data.name,
        isDeleted: false,
    };

    const savedNote = await context.note.saveNote(context, note);

    context.auditLog.insert(context, instData, {
        action: AuditLogActionType.Create,
        resourceId: note.customId,
        resourceType: AuditLogResourceType.Note,
        organizationId: getBlockRootBlockId(block),
        resourceOwnerId: block.customId,
    });

    return {
        note: savedNote,
    };
};

export default addNote;
