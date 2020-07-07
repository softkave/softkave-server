import { AuditLogResourceType } from "../../../mongo/audit-log";
import { validate } from "../../../utilities/joiUtils";
import { SubscribeEndpoint } from "./types";
import { subscribeJoiSchema } from "./validation";

const subscribe: SubscribeEndpoint = async (context, instData) => {
  const data = validate(instData.data, subscribeJoiSchema);
  await context.session.assertUser(context.models, instData);
  context.socket.assertSocket(instData);

  switch (data.type) {
    case AuditLogResourceType.Board: {
      const block = await context.block.getBlockById(context.models, data.id);
      context.room.subscribeToBlock(instData.socket, block);
      return;
    }

    case AuditLogResourceType.Note: {
      const note = await context.note.getNoteById(context.models, data.id);
      context.room.subscribeToNote(instData.socket, note);
      return;
    }
  }
};

export default subscribe;
