const userModel = require("../mongo/user");
const { RequestError } = require("../error");
const { validateUpdateUserData } = require("./validation");

async function updateUser({ data }, req) {
  const userData = validateUpdateUserData(data);

  let user = userModel.model
    .findOneAndUpdate(
      {
        customId: req.user.customId
      },
      userData,
      {
        lean: true,
        fields: "customId"
      }
    )
    .exec();

  if (!!!user) {
    throw new RequestError("error", "user does not exist");
  }
}

module.exports = updateUser;
