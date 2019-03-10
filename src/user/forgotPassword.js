const userModel = require("../mongo/user");
const sendChangePasswordEmail = require("./sendChangePasswordEmail");
const {
  addEntryToPasswordDateLog
} = require("./utils");
const newToken = require("./newToken");
const {
  validateUser
} = require("./validator");
const {
  RequestError
} = require("../error");

async function forgotPassword({
  email
}) {
  await validateUser({
    email
  });

  const user = await userModel.model
    .findOne({
      email: email.trim().toLowerCase()
    }, "email forgotPasswordHistory")
    .lean()
    .exec();

  if (!user) {
    throw new RequestError("error", "user does not exist");
  }

  const token = newToken(user, {
    domain: "change-password"
  });

  await sendChangePasswordEmail(user.email, {
    t: token
  });

  user.forgotPasswordHistory = addEntryToPasswordDateLog(
    user.forgotPasswordHistory
  );

  user.save();
}

module.exports = forgotPassword;