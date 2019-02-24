const blockModel = require("../mongo/block");
const { RequestError } = require("../error");

async function canUserPerformAction(
  blockId,
  action,
  userRole,
  projection = ""
) {
  let result = await blockModel.model
    .findOne(
      {
        _id: blockId,
        acl: { $elemMatch: { action, level: { $lte: userRole.level } } }
      },
      "_id " + projection
    )
    .exec();

  if (!result) {
    throw new RequestError("error", "permission denied");
  }

  if (projection === "") {
    return true;
  } else {
    return result;
  }
}

module.exports = canUserPerformAction;
