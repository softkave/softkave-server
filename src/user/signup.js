const userModel = require("../mongo/user");
const argon2 = require("argon2");
const newToken = require("./newToken");
const { validateUserSignupData: validateUser } = require("./validate");
const userExists = require("./userExists");
const { RequestError } = require("../error");
const createRootBlock = require("../block/createRootBlock");
const uuid = require("uuid/v4");

async function signup({ user }, req) {
  // let value = validateUser(user);
  let value = user;
  const userExistsResult = await userExists(value.email);

  if (!!userExistsResult && userExistsResult.userExists) {
    throw new RequestError("email", "email address is not available");
  }

  try {
    value.hash = await argon2.hash(value.password);
    value.customId = uuid();
    delete value.password;
    let newUser = new userModel.model(user);
    newUser = await newUser.save();

    // for getUserFromReq, it caches user data in fetchedUser
    req.fetchedUser = newUser;
    await createRootBlock(newUser, req);

    return {
      user: newUser,
      token: newToken(newUser)
    };
  } catch (error) {
    // adding a user fails with code 11000 if unique fields in this case email exists
    if (error.code === 11000) {
      throw new RequestError("email", "email address is not available");
    }

    // to know what kind of error
    console.error(error);
    throw new RequestError("error", "server error");
  }
}

module.exports = signup;
