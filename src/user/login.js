const argon2 = require("argon2");
const newToken = require("./newToken");
const userModel = require("../mongo/user");
const { validatePassword, validateEmail } = require("./validate");
const { RequestError } = require("../error");

async function login({ email, password }) {
  // const emailValue = validateEmail(email);
  // const passwordValue = validatePassword(password);
  const userData = await userModel.model
    .findOne({
      email
    })
    .lean()
    .exec();

  if (!userData || !(await argon2.verify(userData.hash, password))) {
    throw new RequestError("error", "invalid email or password");
  }

  return {
    user: userData,
    token: newToken(userData)
  };
}

module.exports = login;
