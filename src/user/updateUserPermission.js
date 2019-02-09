const getUserFromReq = require("../getUserFromReq");
const findUserPermission = require("./findUserPermission");

async function updateUserPermission(req, blockId, permission) {
  let user = await getUserFromReq(req);
  let currentPermission = await findUserPermission(req, blockId);
  let newPermission = { ...currentPermission, ...permission };
  user.permission.pull(currentPermission._id);
  user.permission.push(newPermission);
  await user.save();
}

module.exports = updateUserPermission;
