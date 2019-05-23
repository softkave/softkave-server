const argon2 = require("argon2");
const newToken = require("./newToken");
const { validateUserSignupData } = require("./validation");
const userExists = require("./userExists");
const { RequestError } = require("../../utils/error");
const createRootBlock = require("../block/createRootBlock");
const uuid = require("uuid/v4");

async function signup({ user, userModel }) {
  let value = validateUserSignupData(user);
  const userExistsResult = await userExists(value);

  if (!!userExistsResult && userExistsResult.userExists) {
    throw new RequestError("email", "email address is not available");
  }

  try {
    value.hash = await argon2.hash(value.password);
    value.customId = uuid();
    delete value.password;
    let newUser = new userModel.model(value);
    newUser = await newUser.save();
    await createRootBlock({ user: newUser });

    return {
      user: newUser,
      token: newToken(newUser)
    };
  } catch (error) {
    // adding a user fails with code 11000 if unique fields in this case email exists
    if (error.code === 11000) {
      throw new RequestError("email", "email address is not available");
    }

    // to know what kind of error in console logs
    console.error(error);
    throw new RequestError("error", "server error");
  }
}

module.exports = signup;