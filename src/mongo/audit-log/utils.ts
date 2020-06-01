import { BlockType, IBlock } from "../block";
import { AuditLogResourceType } from "./definitions";

export function getBlockAuditLogResourceType(
  block: IBlock
): AuditLogResourceType {
  switch (block.type) {
    case BlockType.Board:
      return AuditLogResourceType.Board;

    case BlockType.Org:
      return AuditLogResourceType.Org;

    case BlockType.Root:
      return AuditLogResourceType.RootBlock;

    case BlockType.Task:
      return AuditLogResourceType.Task;
  }
}
