const argon2 = require("argon2");
const newToken = require("./newToken");
const userModel = require("../mongo/user");
const {
  validateUser
} = require("./validator");
const {
  RequestError
} = require("../error");
const {
  trimObject
} = require("../utils");

async function login({
  user
}) {
  await validateUser(user);
  trimObject(user);

  const userData = await userModel.model
    .findOne({
      email: user.email.toLowerCase()
    })
    .lean()
    .exec();

  if (!userData || !(await argon2.verify(userData.hash, user.password))) {
    return new RequestError("error", "invalid email or password");
  }

  return {
    user: userData,
    token: newToken(userData)
  };
}

module.exports = login;