const userModel = require("../mongo/user");
const sendChangePasswordEmail = require("./sendChangePasswordEmail");
const { addEntryToPasswordDateLog } = require("./utils");
const newToken = require("./newToken");
const { RequestError } = require("../error");
const { validateEmail } = require("./validation");

async function forgotPassword({ email }) {
  const emailValue = validateEmail(email);
  const user = await userModel.model
    .findOne(
      {
        email: emailValue
      },
      "email forgotPasswordHistory"
    )
    .lean()
    .exec();

  if (!user) {
    throw new RequestError("error", "user does not exist");
  }

  const expirationDuration = "1 day";
  const token = newToken(user, {
    domain: "change-password",
    exp: expirationDuration
  });

  await sendChangePasswordEmail(
    user.email,
    {
      t: token
    },
    expirationDuration
  );

  user.forgotPasswordHistory = addEntryToPasswordDateLog(
    user.forgotPasswordHistory
  );

  user.save();
}

module.exports = forgotPassword;
