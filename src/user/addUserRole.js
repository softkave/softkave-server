const getUserFromReq = require("../getUserFromReq");
const findUserRole = require("./findUserRole");
const {
  RequestError
} = require("../error");

async function addUserRole(req, role, block) {
  const blockId = block.id || block._id;

  if (await findUserRole(req, blockId, true)) {
    throw new RequestError("error", "role exist");
  }

  let user = await getUserFromReq(req);
  user.roles.push({
    role: role.role,
    blockId: blockId,
    hierarchy: role.hierarchy,
    assignedBy: user._id,
    assignedAt: Date.now(),
    type: block.type,
  });

  await user.save();
}

module.exports = addUserRole;