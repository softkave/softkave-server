const getUserFromReq = require("../getUserFromReq");
const findUserPermission = require("./findUserPermission");
const { RequestError } = require("../error");

async function addUserPermission(req, permission) {
  if (await findUserPermission(req, permission.blockId, true)) {
    throw new RequestError("error", "permission exist.");
  }

  let user = await getUserFromReq(req);
  user.permissions.push(permission);
  await user.save();
}

module.exports = addUserPermission;
