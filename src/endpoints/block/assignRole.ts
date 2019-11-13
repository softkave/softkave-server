import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joi-utils";
import { update } from "../../utils/utils";
import { joiSchemas } from "../../utils/validation-utils";
import getRole from "../block/getRole";
import getUser from "../user/getUser";
import { IUserDocument } from "../user/user";
import { findRole, findRoleIndex } from "../user/utils";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import blockError from "./blockError";
import { getRootParentID } from "./utils";
import {
  blockParamSchema,
  roleNameSchema,
  validateRoleName
} from "./validation";

export interface IAssignRoleParameters {
  block: IBlockDocument;
  collaborator: string;
  user: IUserDocument;
  roleName: string;
  accessControlModel: AccessControlModel;
  userModel: UserModel;
  assignedBySystem: boolean;
}

const assignRoleJoiSchema = Joi.object().keys({
  collaborator: joiSchemas.uuidSchema,
  roleName: roleNameSchema
});

async function assignRole({
  block,
  collaborator,
  user,
  roleName,
  accessControlModel,
  userModel,
  assignedBySystem
}: IAssignRoleParameters) {
  // const result = validate({ collaborator, roleName }, assignRoleJoiSchema);
  // collaborator = result.collaborator;
  // roleName = result.roleName;
  // const fetchedCollaborator = await getUser({
  //   collaborator,
  //   userModel,
  //   required: true
  // });
  // if (!assignedBySystem) {
  //   await accessControlCheck({
  //     user,
  //     block,
  //     accessControlModel,
  //     actionName: blockActionsMap.ASSIGN_ROLE
  //   });
  // }
  // const orgId = getRootParentID(block);
  // // to check if role exists
  // await getRole({
  //   block,
  //   accessControlModel,
  //   roleName,
  //   required: true
  // });
  // const currentRole = findRole(fetchedCollaborator, orgId);
  // const newRole = {
  //   roleName,
  //   orgId,
  //   assignedAt: Date.now(),
  //   assignedBy: assignedBySystem ? "system" : user.customId
  // };
  // fetchedCollaborator.roles = update(
  //   fetchedCollaborator.roles,
  //   currentRole,
  //   newRole,
  //   blockError.roleDoesNotExist,
  //   findRoleIndex
  // );
  // fetchedCollaborator.markModified("roles");
  // await fetchedCollaborator.save();
}

export default assignRole;
