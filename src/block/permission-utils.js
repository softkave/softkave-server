function getPermissionQuery(action, permission) {
  return {
    $elemMatch: {
      action: action.toUpperCase(),
      level: { $lte: permission.level }
    }
  };
}

function getPermissionByBlockId(permissions, blockId) {
  return permissions.find(p => p.blockId === blockId);
}

function getPermissionByParentId(permissions, parentId) {
  return permissions.find(p => p.parentId === parentId);
}

function getPermissionObjByBlockIds(permissions, blockIds) {
  let result = {};
  let blockIdMap = {};
  blockIds.forEach(b => {
    blockIdMap[b] = 1;
  });

  permissions.forEach(p => {
    if (blockIdMap[p.blockId]) {
      result[p.blockId] = p;
    }
  });

  return result;
}

module.export = {
  getPermissionQuery,
  getPermissionByBlockId,
  getPermissionObjByBlockIds,
  getPermissionByParentId
};