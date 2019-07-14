const argon2 = require("argon2");

const newToken = require("./newToken");
const { addEntryToPasswordDateLog } = require("./utils");
const { validatePassword } = require("./validation");

async function changePassword({ password, user }) {
  const passwordValue = validatePassword(password);
  user.hash = await argon2.hash(passwordValue);
  user.changePasswordHistory = addEntryToPasswordDateLog(
    user.changePasswordHistory
  );

  await user.save();
  return {
    user,
    token: newToken(user)
  };
}

module.exports = changePassword;
export {};
