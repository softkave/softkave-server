import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlock } from "../../mongo/block";
import { IUser, IUserDocument } from "../user/user";
import userError from "../user/userError";
import { findRole } from "../user/utils";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import canReadBlock from "./canReadBlock";
import { getRootParentID } from "./utils";

function getAccessControlStrategy(block: IBlock) {
  if (block.roles && Array.isArray(block.roles) && block.roles.length > 0) {
    return "roles";
  } else {
    return "legacy";
  }
}

// TODO: extends endpoint parameters from operation parameters which
// will all be optional, but the required fields will be made required in the endpoint
export interface IAccessControlCheckUsingRoleParameters {
  CRUDActionName?: string;
  actionName?: string;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
  block: IBlockDocument;
}

async function accessControlCheckUsingRole({
  user,
  accessControlModel,
  CRUDActionName,
  actionName,
  block
}: IAccessControlCheckUsingRoleParameters) {
  actionName = actionName || `${CRUDActionName}_${block.type}`;
  actionName = actionName.toUpperCase();
  const orgId = getRootParentID(block) || block.customId;
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
    throw userError.permissionDenied;
  }

  return permit;
}

export interface IAccessControlCheckUsingOrgsParameters {
  user: IUser;
  block: IBlock;
}

function accessControlCheckUsingOrgs({
  user,
  block
}: IAccessControlCheckUsingOrgsParameters) {
  return canReadBlock({ block, user });
}

export type IAccessControlCheckParameters = IAccessControlCheckUsingOrgsParameters &
  IAccessControlCheckUsingRoleParameters;

async function accessControlCheck(params: IAccessControlCheckParameters) {
  const accessControlStrategy = getAccessControlStrategy(params.block);

  if (accessControlStrategy === "roles") {
    return accessControlCheckUsingRole(params);
  } else {
    return accessControlCheckUsingOrgs(params);
  }
}

export default accessControlCheck;
