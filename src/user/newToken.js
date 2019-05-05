const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function newToken(user, additionalInfo) {
  return jwt.sign(
    {
      customId: user.customId,
      email: user.email,
      changePasswordHistory: user.changePasswordHistory,
      domain: "login",
      ...additionalInfo
    },
    JWT_SECRET
  );
}

module.exports = newToken;
