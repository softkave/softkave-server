const sendChangePasswordEmail = require("./sendChangePasswordEmail");
const { addEntryToPasswordDateLog } = require("./utils");
const newToken = require("./newToken");
const { validateEmail } = require("./validation");
const { userErrors } = require("../../utils/userError");
const { jwtConstants } = require("../../utils/jwt-constants");

const linkExpirationDuration = "1 day";

async function forgotPassword({ email, userModel }) {
  const emailValue = validateEmail(email);
  const user = await userModel.model
    .findOne({
      email: emailValue
    })
    .exec();

  if (!user) {
    throw userErrors.userDoesNotExist;
  }

  const expirationDuration = linkExpirationDuration;
  const token = newToken(user, {
    domain: jwtConstants.domains.changePassword,
    expiresIn: expirationDuration
  });

  await sendChangePasswordEmail({
    emailAddress: user.email,
    query: { t: token },
    expiration: expirationDuration
  });

  user.forgotPasswordHistory = addEntryToPasswordDateLog(
    user.forgotPasswordHistory
  );

  user.save();
}

module.exports = forgotPassword;
export {};
