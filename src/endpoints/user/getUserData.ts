const newToken = require("./newToken");
const { userErrors } = require("../../utils/userError");

async function getUserData({ user }) {
  if (!user) {
    throw userErrors.userDoesNotExist;
  }

  return { user, token: newToken(user) };
}

module.exports = getUserData;
export {};
