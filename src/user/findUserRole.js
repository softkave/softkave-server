const getUserFromReq = require("../getUserFromReq");
const {
  RequestError
} = require("../error");

async function findUserRole(req, blockId, noThrow) {
  if (req.user && req.user.domain !== "login") {
    throw new RequestError("user", "invalid credentials");
  }

  const user = await getUserFromReq(req);
  const role = user.roles.find(
    role => role.blockId === blockId
  );

  if (!role && !noThrow) {
    throw new RequestError("error", "permission denied");
  }

  return role;
}

module.exports = findUserRole;