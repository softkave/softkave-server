import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlockDocument } from "../../mongo/block";
import BlockModel from "../../mongo/block/BlockModel";
import { indexArray } from "../../utils/functionUtils";
import { validate } from "../../utils/joiUtils";
import OperationError from "../../utils/OperationError";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { blockErrorFields, blockErrorMessages } from "./blockError";
import { blockConstants } from "./constants";
import getBlockRoles from "./getBlocksAccessControlData";
import { roleNameArraySchema } from "./validation";

// TODO: define types
function indexRoles(roles: any) {
  return indexArray(roles, {
    indexer: (role: any) => role.roleName,
    reducer: (role: any, arr: any, index: any) => ({ role, index })
  });
}

function getAccessControlUpdateWithRole(
  bulkAccessControlUpdates: any,
  role: any,
  newRole: any
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

function getUserUpdateWithRole(bulkUserUpdates: any, role: any, newRole: any) {
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
  existingRoles: any,
  indexedRoles: any,
  roles: any,
  bulkUserUpdates: any,
  bulkAccessControlUpdates: any
) {
  existingRoles.forEach((role: any, index: any) => {
    if (!indexedRoles[role.roleName]) {
      const newRole =
        index < roles.length ? roles[index] : roles[roles.length - 1];

      getUserUpdateWithRole(bulkUserUpdates, role, newRole);
      getAccessControlUpdateWithRole(bulkAccessControlUpdates, role, newRole);
    }
  });
}

// TODO: think on using a generic interface that contains all the models, and extending it instead
export interface IUpdateRolesParameters {
  block: IBlockDocument;
  user: IUserDocument;
  roles: string[];
  accessControlModel: AccessControlModel;
  userModel: BlockModel;
}

const updateRolesJoiSchema = Joi.object().keys({
  roles: roleNameArraySchema
});

async function updateRoles({
  block,
  user,
  roles,
  accessControlModel,
  userModel
}: IUpdateRolesParameters) {
  const result = validate({ roles }, updateRolesJoiSchema);
  roles = result.roles;

  if (block.type !== blockConstants.blockTypes.org) {
    throw new OperationError(
      blockErrorFields.invalidOperation,
      blockErrorMessages.accessControlOnTypeOtherThanOrg
    );
  }

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

  // TODO: define type
  const bulkUserUpdates: any[] = [];
  const bulkAccessControlUpdates: any[] = [];

  /**
   * TODO:
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

  block.roles = roles.map(role => {
    return {
      roleName: role,
      createdAt: Date.now(),
      createdBy: user.customId
    };
  });

  await block.save();

  if (bulkUserUpdates.length > 0) {
    await userModel.model.bulkWrite(bulkUserUpdates);
    await accessControlModel.model.bulkWrite(bulkAccessControlUpdates);
  }
}

export default updateRoles;
