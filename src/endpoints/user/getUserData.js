const newToken = require("./newToken");
const { errors: userErrors } = require("../../utils/userErrorMessages");

async function getUserData({ user }) {
  if (!user) {
    throw userErrors.userDoesNotExist;
  }

  return { user, token: newToken(user) };
}

module.exports = getUserData;
