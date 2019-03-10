const userModel = require("../mongo/user");

async function userExists({
  email
}) {
  const user = await userModel.model
    .findOne({
      email: email.trim().toLowerCase()
    }, "_id", {
      lean: true
    })
    .exec();

  return !!user;
}

module.exports = userExists;