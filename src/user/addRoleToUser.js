const userModel = require("../mongo/user");

async function addRoleToUser(user, role) {
  await userModel.newModel().updateOne({
    _id: user._id
  }, {
    roles: {
      $push: role
    }
  });
}

module.exports = addRoleToUser;