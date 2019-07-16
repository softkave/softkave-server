import { blockErrors } from "../../utils/blockError";
import { getRootParentID } from "./utils";

async function getRole({ accessControlModel, roleName, block, required }) {
  const query = {
    roleName,
    orgId: getRootParentID(block)
  };

  const role = await accessControlModel.model.findOne(query).exec();

  if (!role && required) {
    throw blockErrors.roleDoesNotExist;
  }

  return role;
}

module.exports = getRole;
export {};
