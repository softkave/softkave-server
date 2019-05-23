const { RequestError } = require("../../utils/error");
const { validateUpdateUserData } = require("./validation");

async function updateUser({ data, userModel, user }) {
  const userData = validateUpdateUserData(data);

  let user = userModel.model
    .findOneAndUpdate(
      {
        customId: user.customId
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
