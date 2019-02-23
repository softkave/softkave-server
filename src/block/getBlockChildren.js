const blockModel = require("../mongo/block");
const { blockTypes, getParentsLength } = require("./utils");
const findUserPermission = require("../user/findUserPermission");
const canUserPerformAction = require("./canUserPerformAction");

async function getBlockChildren({ block, types }, req) {
  // validate if block types are unique

  const role = await findUserPermission(req, block.id);
  const parentBlock = await canUserPerformAction(
    block.id,
    "READ",
    role,
    "parents"
  );

  const childrenBlocks = await blockModel.model
    .find({
      parents: {
        $size: getParentsLength(parentBlock) + 1,
        $eq: parentBlock.Id
      },
      type: { $in: types || blockTypes },
      acl: { $elemMatch: { action: "READ", level: { $lte: role.level } } }
    })
    .lean()
    .exec();

  return { blocks: childrenBlocks };
}

module.exports = getBlockChildren;
