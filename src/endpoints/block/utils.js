function getImmediateParentId(block) {
  if (blockHasParents(block)) {
    return block.parents[block.parents.length - 1];
  }
}

function blockHasParents(block) {
  return block && Array.isArray(block.parents) && block.parents.length > 0;
}

function getParentsLength(block) {
  if (blockHasParents(block)) {
    return block.parents.length;
  }

  return 0;
}

function getRootParentId(block) {
  let rootId = null;

  if (blockHasParents(block)) {
    rootId = block.parents[0];
  }

  rootId = rootId || block.customId;
  return rootId;
}

function isParentInBlock(block, parentId) {
  if (blockHasParents(block)) {
    return !!block.parents.find(parent => parent === parentId);
  }

  return false;
}

module.exports = {
  getImmediateParentId,
  blockHasParents,
  getRootParentId,
  isParentInBlock,
  getParentsLength
};
