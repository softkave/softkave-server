const blockModel = require("../mongo/block");
const { blockTypes } = require("./utils");
const { validateBlockType } = require("./validator");
const { RequestError } = require("../error");
const getBlocks = require("./getBlocks");
const { getPermissionByParentId } = require("./permission-utils");

function areTypesUnique(types) {
  let typeMap = {};
  return !types.some(type => {
    validateBlockType(type);
    if (typeMap[type]) {
      return true;
    } else {
      typeMap[type] = 1;
      return false;
    }
  });
}

async function getBlockChildren({ block, types }, req) {
  if (types && !areTypesUnique(types)) {
    throw new RequestError("types", "types are not unique");
  }

  const parentBlock = await getBlocks({ blocks: [block] }, req)[0];
  if (!parentBlock) {
    throw new RequestError("error", "permission denied");
  }

  // TODO: check fields to query
  const childrenBlocks = await blockModel.model.find(
    {
      parents: parentBlock._id,
      // TODO: query parents field length
      type: { $in: types || blockTypes }
    },
    "_id type parents"
  ).lean().exec();

  // let query = {
  //   parents: parentBlock._id,
  //   // TODO: query parents field length
  //   type: { $in: types || blockTypes },
  //   acl: { 
  //     $in: types.map(() => {
  //       const permission = getPermissionByParentId(user.permissions, parentBlock._id);
  //       return getPermissionQuery(`READ`, permission)
  //     })
  //   }
  // };

  // const blocks = await blockModel.model.find(query).lean().exec();
  // return { blocks };

  return await getBlocks({ blocks: childrenBlocks }, req);
}

module.exports = getBlockChildren;
