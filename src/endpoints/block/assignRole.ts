const accessControlCheck = require("./accessControlCheck");
const { blockActionsMap } = require("./actions");
const getRole = require("../block/getRole");
const getUser = require("../user/getUser");
const { update } = require("../../utils/utils");
const { getRootParentId } = require("./utils");
const { findRole, findRoleIndex } = require("../user/utils");
const { blockErrors } = require("../../utils/blockError");
const { validateRoleName } = require("./validation");

async function assignRole({
  block,
  collaborator,
  user,
  roleName,
  accessControlModel,
  userModel,
  assignedBySystem
}) {
  collaborator = await getUser({
    collaborator,
    userModel,
    required: true
  });

  if (!assignedBySystem) {
    await accessControlCheck({
      user,
      block,
      accessControlModel,
      actionName: blockActionsMap.ASSIGN_ROLE
    });
  }

  validateRoleName(roleName);
  const orgId = getRootParentId(block);

  // check if role exists
  await getRole({
    block,
    accessControlModel,
    roleName,
    block,
    required: true
  });

  const currentRole = findRole(collaborator, orgId);
  const newRole = {
    roleName,
    orgId,
    assignedAt: Date.now(),
    assignedBy: assignedBySystem ? "system" : user.customId
  };

  collaborator.roles = update(
    collaborator.roles,
    currentRole,
    newRole,
    blockErrors.roleDoesNotExist,
    findRoleIndex
  );

  collaborator.markModified("roles");
  await collaborator.save();
}

module.exports = assignRole;
export {};
