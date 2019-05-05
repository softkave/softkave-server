const { RequestError } = require("../error");
const changePassword = require("./changePassword");

async function changePasswordWithToken(arg, req) {
  if (req.user && req.user.domain !== "change-password") {
    throw new RequestError("error", "invalid credentials");
  }

  return await changePassword(arg, req);
}

module.exports = changePasswordWithToken;
