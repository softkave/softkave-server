import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import UserModel from "../../mongo/user/UserModel";
import { update } from "../../utils/utils";
import getRole from "../block/getRole";
import getUser from "../user/getUser";
import { IUserDocument } from "../user/user";
import { findRole, findRoleIndex } from "../user/utils";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import blockError from "./blockError";
import { getRootParentID } from "./utils";
import { validateRoleName } from "./validation";

export interface IAssignRoleParameters {
  block: IBlockDocument;
  collaborator: string;
  user: IUserDocument;
  roleName: string;
  accessControlModel: AccessControlModel;
  userModel: UserModel;
  assignedBySystem: boolean;
}

async function assignRole({
  block,
  collaborator,
  user,
  roleName,
  accessControlModel,
  userModel,
  assignedBySystem
}: IAssignRoleParameters) {
  const fetchedCollaborator = await getUser({
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
  const orgId = getRootParentID(block);

  // to check if role exists
  await getRole({
    block,
    accessControlModel,
    roleName,
    required: true
  });

  const currentRole = findRole(fetchedCollaborator, orgId);
  const newRole = {
    roleName,
    orgId,
    assignedAt: Date.now(),
    assignedBy: assignedBySystem ? "system" : user.customId
  };

  fetchedCollaborator.roles = update(
    fetchedCollaborator.roles,
    currentRole,
    newRole,
    blockError.roleDoesNotExist,
    findRoleIndex
  );

  fetchedCollaborator.markModified("roles");
  await fetchedCollaborator.save();
}

export default assignRole;
