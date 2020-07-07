import { Socket } from "socket.io";
import { AuditLogResourceType } from "../../mongo/audit-log";
import { IBlock } from "../../mongo/block";
import { INote } from "../../mongo/note";

export interface IRoomContext {
  subscribeToBlock: (socket: Socket, block: IBlock) => void;
  subscribeToNote: (socket: Socket, note: INote) => void;
}

export default class RoomContext implements IRoomContext {
  public subscribeToBlock(socket: Socket, block: IBlock) {
    socket.join(`${block.type}-${block.customId}`);
  }

  public subscribeToNote(socket: Socket, note: INote) {
    socket.join(`${AuditLogResourceType.Note}-${note.customId}`);
  }
}
