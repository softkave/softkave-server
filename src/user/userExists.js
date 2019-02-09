const userModel = require("../mongo/user");

async function userExists({ email }) {
  const user = await userModel.model
    .findOne({ email }, "_id", { lean: true })
    .exec();

  return !!user;
}

module.exports = userExists;
