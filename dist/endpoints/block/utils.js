"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getImmediateParentID(block) {
    if (blockHasParents(block)) {
        return block.parents[block.parents.length - 1];
    }
}
exports.getImmediateParentID = getImmediateParentID;
function blockHasParents(block) {
    return block && Array.isArray(block.parents) && block.parents.length > 0;
}
exports.blockHasParents = blockHasParents;
function getParentsLength(block) {
    if (blockHasParents(block)) {
        return block.parents.length;
    }
    return 0;
}
exports.getParentsLength = getParentsLength;
function getRootParentID(block) {
    let rootId = null;
    if (blockHasParents(block)) {
        rootId = block.parents[0];
    }
    rootId = rootId || block.customId;
    return rootId;
}
exports.getRootParentID = getRootParentID;
function isParentInBlock(block, parentId) {
    if (blockHasParents(block)) {
        return !!block.parents.find(parent => parent === parentId);
    }
    return false;
}
exports.isParentInBlock = isParentInBlock;
//# sourceMappingURL=utils.js.map