import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlockDocument } from "./block";
import blockError from "./blockError";
import { getRootParentID } from "./utils";

export interface IGetRoleParameters {
  accessControlModel: AccessControlModel;
  roleName: string;
  block: IBlockDocument;
  required: boolean;
}

async function getRole({
  accessControlModel,
  roleName,
  block,
  required
}: IGetRoleParameters) {
  const query = {
    roleName,
    orgId: getRootParentID(block)
  };

  const role = await accessControlModel.model.findOne(query).exec();

  if (!role && required) {
    throw blockError.roleDoesNotExist;
  }

  return role;
}

export default getRole;
