function getImmediateParentId(block) {
  if (blockHasParents(block)) {
    return block.parents[block.parents.length - 1];
  }
}

function blockHasParents(block) {
  if (Array.isArray(block.parents) && block.parents.length > 0) {
    return true;
  }

  return false;
}

function getRootParentId(block) {
  if (blockHasParents(block)) {
    return block.parents[0];
  }
}

function isParentInBlock(block, parentId) {
  if (blockHasParents(block)) {
    return !!block.parents.find(parent => parent === parentId);
  }

  return false;
}

const blockTypes = ["group", "org", "project", "task", "root"];
const blockTypesObj = {
  group: 1,
  org: 1,
  project: 1,
  task: 1,
  root: 1
};

const defaultRoles = [];
const defaultAcl = [];

module.exports = {
  getImmediateParentId,
  blockHasParents,
  getRootParentId,
  isParentInBlock,
  blockTypes,
  defaultAcl,
  defaultRoles,
  blockTypesObj
};
