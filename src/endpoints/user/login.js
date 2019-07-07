const argon2 = require("argon2");

const newToken = require("./newToken");
const { validatePassword, validateEmail } = require("./validation");
const { errors: userErrors } = require("../../utils/userErrorMessages");

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
    throw userErrors.invalidLoginCredentials;
  }

  return {
    user: userData,
    token: newToken(userData)
  };
}

module.exports = login;
