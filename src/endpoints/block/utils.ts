import { IBlock } from "./block";

export function getImmediateParentID(block: IBlock) {
  if (blockHasParents(block)) {
    return block.parents[block.parents.length - 1];
  }
}

export function blockHasParents(block: IBlock) {
  return block && Array.isArray(block.parents) && block.parents.length > 0;
}

export function getParentsLength(block: IBlock) {
  if (blockHasParents(block)) {
    return block.parents.length;
  }

  return 0;
}

export function getRootParentID(block: IBlock) {
  let rootId = null;

  if (blockHasParents(block)) {
    rootId = block.parents[0];
  }

  rootId = rootId || block.customId;
  return rootId;
}

export function isParentInBlock(block: IBlock, parentId: string) {
  if (blockHasParents(block)) {
    return !!block.parents.find(parent => parent === parentId);
  }

  return false;
}