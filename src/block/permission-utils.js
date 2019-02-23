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

function getPermissionObjByBlockIds(permissions, blocks) {
  let result = {};
  let blockIdMap = {};
  blocks.forEach(b => {
    blockIdMap[b.id] = 1;
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
  getPermissionObjByBlockIds
};
