//const userModel = require("../mongo/user");
const getUserFromReq = require("../getUserFromReq");
const findUserPermission = require("./findUserPermission");
const { RequestError } = require("../error");

async function addUserPermission(/*user, permission, */ req, permission) {
  if (await findUserPermission(req, permission.blockId, true)) {
    throw new RequestError("error", "permission exist.");
  }

  let user = await getUserFromReq(req);
  user.permissions.push(permission);
  await user.save();
  /*await userModel.newModel().updateOne(
    { _id: user.id },
    {
      permissions: {
        $push: permission
      }
    }
  );*/
}

module.exports = addUserPermission;
