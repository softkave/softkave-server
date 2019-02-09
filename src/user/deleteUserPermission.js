const getUserFromReq = require("../getUserFromReq");
const findUserPermission = require("./findUserPermission");
const { RequestError } = require("../error");

async function deleteUserPermission(req, blockId) {
  let user = await getUserFromReq(req);
  let permission = await findUserPermission(req, blockId);
  if (!permission) {
    throw new RequestError("error", "permission does not exist.");
  }

  user.permission.pull(permission._id);
  await user.save();
}

module.exports = deleteUserPermission;
