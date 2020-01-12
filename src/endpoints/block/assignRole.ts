import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlockDocument } from "../../mongo/block";
import UserModel from "../../mongo/user/UserModel";
import { IUserDocument } from "../user/user";

export interface IAssignRoleParameters {
  block: IBlockDocument;
  collaborator: string;
  user: IUserDocument;
  roleName: string;
  accessControlModel: AccessControlModel;
  userModel: UserModel;
  assignedBySystem: boolean;
}

async function assignRole(params: IAssignRoleParameters) {}

export default assignRole;
