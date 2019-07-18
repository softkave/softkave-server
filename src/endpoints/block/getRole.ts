import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { validate } from "../../utils/joi-utils";
import { IBlockDocument } from "./block";
import blockError from "./blockError";
import { getRootParentID } from "./utils";
import { blockParamSchema, roleNameSchema } from "./validation";

export interface IGetRoleParameters {
  accessControlModel: AccessControlModel;
  roleName: string;
  block: IBlockDocument;
  required: boolean;
}

const getRoleJoiSchema = Joi.object().keys({
  roleName: roleNameSchema
});

// TODO: separate internal usage from external usage
async function getRole({
  accessControlModel,
  roleName,
  block,
  required
}: IGetRoleParameters) {
  const result = validate({ roleName }, getRoleJoiSchema);
  roleName = result.roleName;
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
