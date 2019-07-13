const differenceWith = require("lodash/differenceWith");

const accessControlCheck = require("./accessControlCheck");
const { blockActionsMap } = require("./actions");
const getRole = require("../block/getRole");
const getUser = require("../user/getUser");
const { update, indexArray } = require("../../utils/utils");
const { getRootParentId } = require("./utils");
const { findRole, findRoleIndex, areRolesSame } = require("../user/utils");
const { errors: blockErrors } = require("../../utils/blockErrorMessages");
const { validateRoleName } = require("./validation");
const getBlockRoles = require("./getBlocksAccessControlData");

function indexRoles(roles) {
  return indexArray(roles, {
    indexer: role => role.roleName,
    reducer: (role, arr, index) => ({ role, index })
  });
}

async function updateRoles({
  block,
  collaborator,
  user,
  roles,
  accessControlModel,
  blockModel,
  userModel,
  assignedBySystem
}) {
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

  const removedRoles = differenceWith(existingRoles, roles, areRolesSame);

  // update users with roles that are removed to new ones in the same index

  /**
   * when a user is removed from an org, send a removed error, and show a notification modal,
   * prompt the user to respond, then remove or delete org from UI
   *
   * same when the user's access is revoked from some features
   *
   * maybe query or poll for role changes, or every query returns latest role data,
   * so that the UI can respond, or use websockets
   */

  const updates = existingRoles.reduce((accumulator, role, index) => {
    if (!indexRoles[role.roleName]) {
      const newRole =
        index < roles.length ? roles[index] : roles[roles.length - 1];
      accumulator.push({
        updateMany: {
          filter: {
            roles: {
              $elemMatch: { roleName: role.roleName, orgId: role.orgId }
            }
          },
          update: {
            $pull: {
              roles: {}
            },
            $push: {
              roleName: newRole.roleName,
              orgId: newRole.orgId
            }
          }
        }
      });
    }

    return accumulator;
  }, []);
}

module.exports = updateRoles;
