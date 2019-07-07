const { validateUpdateUserData } = require("./validation");
const { errors: userErrors } = require("../../utils/userErrorMessages");

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
    throw userErrors.userDoesNotExist;
  }
}

module.exports = updateUser;
