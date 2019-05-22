const newToken = require("./newToken");
const { RequestError } = require("../../utils/error");

async function getUserData({ user }) {
  if (!user) {
    throw new RequestError("error", "user does not exist");
  }

  return { user, token: newToken(user) };
}

module.exports = getUserData;
