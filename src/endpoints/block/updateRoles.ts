const differenceWith = require("lodash/differenceWith");

const accessControlCheck = require("./access-control-check");
const { blockActionsMap } = require("./actions");
const getRole = require("../block/getRole");
const getUser = require("../user/getUser");
const { update, indexArray } = require("../../utils/utils");
const { findRole, findRoleIndex, areRolesSame } = require("../user/utils");
const {
  blockError,
  blockErrorFields,
  blockErrorMessages
} = require("../../utils/blockError");
const { validateRoleNameArray } = require("./validation");
const getBlockRoles = require("./getBlocksAccessControlData");
const { blockConstants } = require("./constants");
const { RequestError } = require("../../utils/RequestError");

function indexRoles(roles) {
  return indexArray(roles, {
    indexer: role => role.roleName,
    reducer: (role, arr, index) => ({ role, index })
  });
}

function getAccessControlUpdateWithRole(
  bulkAccessControlUpdates,
  role,
  newRole
) {
  bulkAccessControlUpdates.push({
    updateMany: {
      filter: {
        permittedRoles: role.roleName
      },
      update: {
        "permittedRoles.$": newRole.roleName
      }
    }
  });
}

function getUserUpdateWithRole(bulkUserUpdates, role, newRole) {
  bulkUserUpdates.push({
    updateMany: {
      filter: {
        roles: {
          $elemMatch: { roleName: role.roleName, orgId: role.orgId }
        }
      },
      update: {
        "roles.$": newRole
      }
    }
  });
}

function getBulkWriteUpdates(
  existingRoles,
  indexedRoles,
  roles,
  bulkUserUpdates,
  bulkAccessControlUpdates
) {
  existingRoles.forEach((role, index) => {
    if (!indexedRoles[role.roleName]) {
      const newRole =
        index < roles.length ? roles[index] : roles[roles.length - 1];

      getUserUpdateWithRole(bulkUserUpdates, role, newRole);
      getAccessControlUpdateWithRole(bulkAccessControlUpdates, role, newRole);
    }
  });
}

async function updateRoles({
  block,
  user,
  roles,
  accessControlModel,
  // blockModel,
  userModel
}) {
  if (block.type !== blockConstants.blockTypes.org) {
    throw new RequestError(
      blockErrorFields.invalidOperation,
      blockErrorMessages.accessControlOnTypeOtherThanOrg
    );
  }

  validateRoleNameArray(roles);
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.UPDATE_ROLES
  });

  const existingRoles = await getBlockRoles({
    block,
    user,
    accessControlModel
  });

  const indexedRoles = indexRoles(roles);
  const bulkUserUpdates = [];
  const bulkAccessControlUpdates = [];

  /**
   * when a user is removed from an org, send a removed error, and show a notification modal,
   * prompt the user to respond, then remove or delete org from UI
   *
   * same when the user's access is revoked from some features
   *
   * maybe query or poll for role changes, or every query returns latest role data,
   * so that the UI can respond, or use websockets
   */

  getBulkWriteUpdates(
    existingRoles,
    indexedRoles,
    roles,
    bulkUserUpdates,
    bulkAccessControlUpdates
  );

  block.roles = roles;
  await block.save();

  if (bulkUserUpdates.length > 0) {
    await userModel.model.bulkWrite(bulkUserUpdates);
    await accessControlModel.model.bulkWrite(bulkAccessControlUpdates);
  }
}

module.exports = updateRoles;
export {};
