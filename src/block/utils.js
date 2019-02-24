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

function getParentsLength(block) {
  if (blockHasParents(block)) {
    return block.parents.length;
  }

  return 0;
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

const blockTypes = ["group", "org", "project", "task", "root", "info-card"];
const blockTypesObj = {
  group: 1,
  org: 1,
  project: 1,
  task: 1,
  root: 1,
  "info-card": 1,
  "landing-page": 1
};

const blockTypeToChildrenMap = {
  org: { project: 1, group: 1, task: 1 },
  group: { project: 1, task: 1 },
  project: { group: 1, task: 1 }
};

function canBlockBeAChildOf(block, child) {
  let possibleChildren = blockTypeToChildrenMap[block.type];

  if (possibleChildren) {
    return !!possibleChildren[child.type];
  }

  return false;
}

module.exports = {
  getImmediateParentId,
  blockHasParents,
  getRootParentId,
  isParentInBlock,
  blockTypes,
  blockTypesObj,
  getParentsLength,
  canBlockBeAChildOf
};
