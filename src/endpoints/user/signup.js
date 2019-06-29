const argon2 = require("argon2");
const uuid = require("uuid/v4");

const newToken = require("./newToken");
const { validateUserSignupData } = require("./validation");
const userExists = require("./userExists");
const { RequestError } = require("../../utils/error");
const { errors: serverErrors } = require("../../utils/serverErrorMessages");
const {
  errorMessages: userErrorMessages
} = require("../../utils/userErrorMessages");
const createRootBlock = require("../block/createRootBlock");
const { userFieldNames } = require("./constants");
const { constants: mongoDBConstants } = require("../../mongo/constants");

async function signup({ user, userModel, blockModel }) {
  let value = validateUserSignupData(user);
  const userExistsResult = await userExists({ userModel, email: user.email });

  if (!!userExistsResult && userExistsResult.userExists) {
    throw new RequestError(
      userFieldNames.email,
      userErrorMessages.emailAddressNotAvailable
    );
  }

  try {
    value.hash = await argon2.hash(value.password);
    value.customId = uuid();
    delete value.password;
    let newUser = new userModel.model(value);
    newUser = await newUser.save();
    await createRootBlock({ blockModel, user: newUser });

    return {
      user: newUser,
      token: newToken(newUser)
    };
  } catch (error) {
    // Adding a user fails with code 11000 if unique fields in this case email exists
    if (error.code === mongoDBConstants.indexNotUniqueErrorCode) {
      throw new RequestError(
        userFieldNames.email,
        userErrorMessages.emailAddressNotAvailable
      );
    }

    // For debugging purposes
    console.error(error);
    throw serverErrors.serverError;
  }
}

module.exports = signup;
