const getUserFromReq = require("../getUserFromReq");
const { RequestError } = require("../error");

async function findUserPermission(req, blockId, noThrow) {
  if (req.user && req.user.domain !== "login") {
    throw new RequestError("user", "invalid credentials.");
  }

  const user = await getUserFromReq(req);
  const permission = user.permissions.find(
    permission => permission.blockId === blockId
  );

  if (!permission && !noThrow) {
    throw new RequestError("error", "permission denied.");
  }

  return permission;
}

module.exports = findUserPermission;
