import pick from "lodash/pick";
import {
  AuditLogActionType,
  AuditLogResourceType,
} from "../../../mongo/audit-log";
import { getDate } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import canReadNote from "../canReadNote";
import { UpdateNoteEndpoint } from "./types";
import { updateNoteJoiSchema } from "./validation";

const updateNote: UpdateNoteEndpoint = async (context, instData) => {
  const data = validate(instData.data, updateNoteJoiSchema);
  const updateData = data.data;
  const user = await context.session.getUser(context.models, instData);
  const note = await context.note.getNoteById(context.models, data.noteId);
  const block = await context.block.getBlockById(context.models, note.blockId);

  canReadBlock({ user, block });
  canReadNote({ user, block, note });

  await context.note.updateNoteById(context.models, data.noteId, {
    ...updateData,
    updatedAt: getDate(),
    updatedBy: user.customId,
  });

  context.auditLog.insert(context.models, instData, {
    action: AuditLogActionType.Update,
    resourceId: note.customId,
    resourceType: AuditLogResourceType.Note,
    change: {
      oldValue: pick(note, Object.keys(data.data)),
      newValue: data.data,
      customId: getId(),
    },
    resourceOwnerId: block.customId,
    organizationId: getBlockRootBlockId(block),
  });
};

export default updateNote;
