import { IBlock } from "../../mongo/block";
import { IPublicBlock } from "./types";

// @ts-ignore
export function toPublicBlock(block: IBlock): IPublicBlock {
  // TODO
  throw new Error("not implemented yet");
}

export function getBlockRootBlockId(block: IBlock) {
  return block.rootBlockId || block.customId;
}
