const { userErrors } = require("../../utils/userError");
const changePassword = require("./changePassword");
const { jwtConstants } = require("../../utils/jwt-constants");

async function changePasswordWithToken(arg) {
  const { tokenData } = arg;

  if (tokenData && tokenData.domain !== jwtConstants.domains.changePassword) {
    throw userErrors.invalidCredentials;
  }

  return await changePassword(arg);
}

module.exports = changePasswordWithToken;
export {};
