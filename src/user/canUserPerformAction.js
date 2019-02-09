const blockModel = require("../mongo/block");
const findUserPermission = require("./findUserPermission");
const { RequestError } = require("../error");

async function canUserPerformAction(req, action, permissionBlockID) {
  const userBlockPermission = await findUserPermission(req, permissionBlockID);
  let actionsArr = action;
  if (!Array.isArray(action)) {
    actionsArr = [action];
  }

  let aclQuery = actionsArr.map(actionType => ({
    $elemMatch: {
      action: actionType.toUpperCase(),
      level: { $lte: userBlockPermission.level }
    }
  }));

  let result = await blockModel.model.findOne({
    _id: permissionBlockID,
    acl: { $and: aclQuery }
  });

  if (result) {
    return true;
  }

  throw new RequestError("error", "permission denied.");
}

module.exports = canUserPerformAction;
