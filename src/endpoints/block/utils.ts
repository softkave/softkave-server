import { BlockType, IBlock } from "../../mongo/block";
import { IPublicBlock } from "./types";

// @ts-ignore
export function toPublicBlock(block: IBlock): IPublicBlock {
  // TODO
  throw new Error("not implemented yet");
}

export function getBlockRootBlockId(block: IBlock) {
  return block.rootBlockId || block.customId;
}

export function getBlockTypeName(blockType?: BlockType) {
  switch (blockType) {
    case "org":
      return "Organization";

    case "task":
      return "Task";

    case "board":
      return "Board";

    case "root":
    default:
      return "Block";
  }
}
