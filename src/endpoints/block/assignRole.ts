import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import getRole from "../block/getRole";
import getUser from "../user/getUser";
import { update } from "../../utils/utils";
import { getRootParentId } from "./utils";
import { findRole, findRoleIndex } from "../user/utils";
import { blockErrors } from "../../utils/blockError";
import { validateRoleName } from "./validation";

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
