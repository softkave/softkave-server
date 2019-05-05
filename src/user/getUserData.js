const getUserFromReq = require("../getUserFromReq");
const newToken = require("./newToken");
const { RequestError } = require("../error");

async function getUserData(nullArg, req) {
  const user = await getUserFromReq(req);

  if (!user) {
    throw new RequestError("error", "user does not exist");
  }

  return { user, token: newToken(user) };
}

module.exports = getUserData;
