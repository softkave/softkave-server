const argon2 = require("argon2");
const newToken = require("./newToken");
const { addEntryToPasswordDateLog } = require("./utils");
const { RequestError } = require("../../utils/error");
const { validatePassword } = require("./validation");

async function changePassword({ password, user, userModel }) {
  const passwordValue = validatePassword(password);
  const userData = await userModel.model
    .findOne({
      email: user.email
    })
    .lean()
    .exec();

  if (!userData) {
    throw new RequestError("error", "user does not exist");
  }

  userData.hash = await argon2.hash(passwordValue);
  userData.changePasswordHistory = addEntryToPasswordDateLog(
    user.changePasswordHistory
  );

  await user.save();
  return {
    user,
    token: newToken(user)
  };
}

module.exports = changePassword;
