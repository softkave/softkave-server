const argon2 = require("argon2");
const newToken = require("./newToken");
const userModel = require("../mongo/user");
const { addEntryToPasswordDateLog } = require("./utils");
const getUserFromReq = require("../getUserFromReq");
const { RequestError } = require("../error");
const { validatePassword } = require("./validate");

async function changePassword({ password }, req) {
  const passwordValue = validatePassword(password);
  const user = await getUserFromReq(req);
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
