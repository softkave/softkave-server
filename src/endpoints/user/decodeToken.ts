const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function decodeToken(token: string) {
  return jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
}

export default decodeToken;
