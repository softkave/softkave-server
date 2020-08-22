import { AuditLogResourceType } from "../../../mongo/audit-log";
import { validate } from "../../../utilities/joiUtils";
import { SubscribeEndpoint } from "./types";
import { subscribeJoiSchema } from "./validation";

const subscribe: SubscribeEndpoint = async (context, instData) => {
  const data = validate(instData.data, subscribeJoiSchema);
  await context.session.assertUser(context, instData);
  context.socket.assertSocket(instData);

  switch (data.type) {
    case AuditLogResourceType.Org:
    case AuditLogResourceType.Board: {
      const block = await context.block.getBlockById(context, data.customId);
      const roomName = context.room.getBlockRoomName(block);
      context.room.subscribe(instData, roomName);
      return;
    }

    case AuditLogResourceType.Note: {
      const note = await context.note.getNoteById(context, data.customId);
      const roomName = context.room.getNoteRoomName(note);
      context.room.subscribe(instData, roomName);
      return;
    }
  }
};

export default subscribe;
