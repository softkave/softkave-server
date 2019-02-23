const userModel = require("../mongo/user");

async function addPermissionToUser(user, permission) {
  await userModel.newModel().updateOne(
    { _id: user._id },
    {
      permissions: {
        $push: permission
      }
    }
  );
}

module.exports = addPermissionToUser;
