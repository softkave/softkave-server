const { getRootParentId } = require("./utils");
const { errors: blockErrors } = require("../../utils/blockErrorMessages");

async function getRole({ accessControlModel, roleName, block, required }) {
  const query = {
    roleName,
    orgId: getRootParentId(block)
  };

  const role = await accessControlModel.model.findOne(query).exec();

  if (!role && required) {
    throw blockErrors.roleDoesNotExist;
  }

  return role;
}

module.exports = getRole;
