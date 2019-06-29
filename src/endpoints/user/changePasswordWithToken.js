const { errors: userErrors } = require("../../utils/userErrorMessages");
const changePassword = require("./changePassword");
const { constants: jwtConstants } = require("../../utils/jwt-constants");

async function changePasswordWithToken(arg) {
  const { tokenData } = arg;

  if (tokenData && tokenData.domain !== jwtConstants.domains.changePassword) {
    throw userErrors.invalidCredentials;
  }

  return await changePassword(arg);
}

module.exports = changePasswordWithToken;
