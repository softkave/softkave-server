const jwt = require("jsonwebtoken");

const { jwtConstants } = require("../../utils/jwt-constants");

const JWT_SECRET = process.env.JWT_SECRET;

function newToken(user, additionalInfo) {
  return jwt.sign(
    {
      customId: user.customId,
      email: user.email,
      changePasswordHistory: user.changePasswordHistory,
      domain: jwtConstants.domains.login,
      ...additionalInfo
    },
    JWT_SECRET
  );
}

module.exports = newToken;
export {};
