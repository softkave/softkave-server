const blockModel = require("../mongo/block");
const {
  blockTypes,
  getParentsLength
} = require("./utils");
const findUserRole = require("../user/findUserRole");
const canUserPerformAction = require("./canUserPerformAction");
const {
  RequestError
} = require("../error");
const {
  indexArr
} = require("../utils");

async function getBlockChildren({
  block,
  types
}, req) {
  if (types.length > blockTypes.length) {
    throw new RequestError("types", "maximum length exceeded");
  }

  if (types) {
    let typesMap = indexArr(types, type => type.trim());
    types = Object.keys(typesMap);
  } else {
    types = blockTypes;
  }

  // TODO: look into avoiding this step, and relying on the acl.action: READ check
  let {
    allowedActions,
    roleBlock
  } = await canUserPerformAction(
    req,
    block,
    types.map(type => `READ_${type.toUpperCase()}`),
    "parents",
    true
  );

  let allowedTypes = allowedActions.map(action => {
    let splitAction = action.split("_");
    let type = splitAction[1];
    return type;
  });

  // TODO: look for a way to bring both acl queries together
  // TODO: query if user can read all parents before can read children
  const parentBlock = roleBlock;
  const role = await findUserRole(req, block.id);
  const childrenBlocks = await blockModel.model
    .find({
      parents: {
        $size: getParentsLength(parentBlock) + 1,
        $eq: parentBlock.Id
      },
      type: {
        $in: allowedTypes
      },
      "acl.action": "READ",
      "acl.roles": role.role
    })
    .lean()
    .exec();

  return {
    blocks: childrenBlocks
  };
}

module.exports = getBlockChildren;