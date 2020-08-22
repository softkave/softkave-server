import { AuditLogResourceType } from "../../../mongo/audit-log";
import { validate } from "../../../utilities/joiUtils";
import { SubscribeEndpoint } from "../subscribe/types";
import { subscribeJoiSchema } from "../subscribe/validation";

const unsubscribe: SubscribeEndpoint = async (context, instData) => {
  const data = validate(instData.data, subscribeJoiSchema);
  await context.session.assertUser(context, instData);
  context.socket.assertSocket(instData);

  switch (data.type) {
    case AuditLogResourceType.Board: {
      const block = await context.block.getBlockById(context, data.customId);
      const roomName = context.room.getBlockRoomName(block);
      context.room.leave(instData, roomName);
      return;
    }

    case AuditLogResourceType.Note: {
      const note = await context.note.getNoteById(context, data.customId);
      const roomName = context.room.getNoteRoomName(note);
      context.room.leave(instData, roomName);
      return;
    }
  }
};

export default unsubscribe;
