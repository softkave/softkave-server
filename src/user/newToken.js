const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../res/jwt-secret");

function newToken(user, additionalInfo) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      changePasswordHistory: user.changePasswordHistory,
      domain: "login",
      ...additionalInfo
    },
    JWT_SECRET
  );
}

module.exports = newToken;
