const argon2 = require("argon2");
const newToken = require("./newToken");
const userModel = require("../mongo/user");
const {
  addEntryToPasswordDateLog
} = require("./utils");
const {
  validateUser
} = require("./validator");
const getUserFromReq = require("../getUserFromReq");
const {
  RequestError
} = require("../error");

async function changePassword({
  password
}, req) {
  const user = await getUserFromReq(req);
  password = password.trim();
  await validateUser({
    password
  });
  const userData = await userModel.model
    .findOne({
      email: user.email
    })
    .lean()
    .exec();

  if (!userData) {
    throw new RequestError("error", "user does not exist.");
  }

  userData.hash = await argon2.hash(password);
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