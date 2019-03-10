const getUserFromReq = require("../getUserFromReq");
const findUserRole = require("./findUserRole");
const {
  RequestError
} = require("../error");

async function deleteUserRole(req, blockId) {
  let user = await getUserFromReq(req);
  let role = await findUserRole(req, blockId);

  if (!role) {
    throw new RequestError("error", "role does not exist");
  }

  user.roles.pull(role._id);
  await user.save();
}

module.exports = deleteUserRole;