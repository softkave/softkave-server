import {
  AuditLogActionType,
  AuditLogResourceType,
} from "../../../mongo/audit-log";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import canReadNote from "../canReadNote";
import { DeleteNoteEndpoint } from "./types";
import { deleteNoteJoiSchema } from "./validation";

const deleteNote: DeleteNoteEndpoint = async (context, instData) => {
  const data = validate(instData.data, deleteNoteJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const note = await context.note.getNoteById(context.models, data.noteId);
  const block = await context.block.getBlockById(context.models, note.blockId);

  canReadBlock({ user, block });
  canReadNote({ user, block, note });
  await context.note.markNoteDeleted(context.models, note.customId, user);

  context.auditLog.insert(context.models, instData, {
    action: AuditLogActionType.Delete,
    resourceId: note.customId,
    resourceType: AuditLogResourceType.Note,
    organizationId: getBlockRootBlockId(block),
    resourceOwnerId: block.customId,
  });
};

export default deleteNote;
