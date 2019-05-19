const userModel = require("../mongo/user");
const { validateEmail } = require("./validation");

async function userExists({ email }) {
  let value = validateEmail(email);
  const user = await userModel.model
    .findOne(
      {
        email: value
      },
      "customId",
      {
        lean: true
      }
    )
    .exec();

  return {
    userExists: !!user
  };
}

module.exports = userExists;
