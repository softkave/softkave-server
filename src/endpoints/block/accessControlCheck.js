const { getRootParentId } = require("./utils");
const { errors: userErrors } = require("../../utils/userErrorMessages");
const { userRoleIsUpgraded, findRole } = require("../user/utils");
const canReadBlock = require("./canReadBlock");
const { blockActionsMap } = require("./actions");

async function accessControlCheckUsingRole({
  user,
  accessControlModel,
  CRUDActionName,
  actionName,
  block
}) {
  actionName = actionName || `${CRUDActionName}_${block.type}`;
  actionName = actionName.toUpperCase();
  const orgId = getRootParentId(block) || block.customId;
  const userRole = findRole(user, orgId);
  let permit = false;

  if (userRole) {
    if (actionName === blockActionsMap.READ_ORG) {
      permit = true;
    } else {
      const query = {
        actionName,
        orgId,
        permittedRoles: userRole.roleName
      };

      permit = !!(await accessControlModel.model
        .findOne(query, "_id")
        .lean()
        .exec());
    }
  }

  if (!permit) {
    throw userErrors.permissionDenied;
  }

  return permit;
}

function accessControlCheckUsingOrgs({ user, block }) {
  return canReadBlock({ block, user });
}

async function accessControlCheck({
  user,
  accessControlModel,
  CRUDActionName,
  actionName,
  block
}) {
  if (userRoleIsUpgraded(user)) {
    return accessControlCheckUsingRole({
      user,
      accessControlModel,
      CRUDActionName,
      actionName,
      block
    });
  } else {
    return accessControlCheckUsingOrgs({ user, block });
  }
}

module.exports = accessControlCheck;
