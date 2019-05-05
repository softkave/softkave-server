const userModel = require("../mongo/user");
const { validateEmail } = require("./validate");

async function userExists({ email }) {
  // let value = validateEmail(email);
  let value = email;
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
