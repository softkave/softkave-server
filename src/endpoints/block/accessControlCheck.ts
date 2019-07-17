import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IUser, IUserDocument } from "../user/user";
import userError from "../user/userError";
import { findRole, userRoleIsUpgraded } from "../user/utils";
import { blockActionsMap } from "./actions";
import { IBlock, IBlockDocument } from "./block";
import canReadBlock from "./canReadBlock";
import { getRootParentID } from "./utils";

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
  if (userRoleIsUpgraded(params.user)) {
    return accessControlCheckUsingRole(params);
  } else {
    return accessControlCheckUsingOrgs(params);
  }
}

export default accessControlCheck;
