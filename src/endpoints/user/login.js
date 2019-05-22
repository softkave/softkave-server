const argon2 = require("argon2");
const newToken = require("./newToken");
const { validatePassword, validateEmail } = require("./validation");
const { RequestError } = require("../../utils/error");

async function login({ email, password, userModel }) {
  email = validateEmail(email);
  password = validatePassword(password);

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
