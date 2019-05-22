const { RequestError } = require("../../utils/error");
const changePassword = require("./changePassword");

async function changePasswordWithToken(arg, req) {
  const { tokenData } = arg;

  if (tokenData && tokenData.domain !== "change-password") {
    throw new RequestError("error", "invalid credentials");
  }

  return await changePassword(arg, req);
}

module.exports = changePasswordWithToken;
