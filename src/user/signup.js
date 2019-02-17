const userModel = require("../mongo/user");
const argon2 = require("argon2");
const newToken = require("./newToken");
const { validateUser } = require("./validator");
const addBlockTodDb = require("../block/addBlockToDb");

async function addRootBlock(newUser, req) {
  let permission = null;
  let rootBlock = {
    name: `root_${user.name}`,
    type: "root",
    createdAt: Date.now(),
    createdBy: user._id,
    acl: null,
    roles: null,
    permission: null,
    color: null
  };

  await addBlockTodDb(rootBlock, req);

  return {
    permission
  };
}

async function signup({ user }, req) {
  await validateUser(user);

  try {
    user.hash = await argon2.hash(user.password);
    let newUser = new userModel.model(user);
    newUser = await newUser.save();
    req.user = newUser;
    req.fetchedUser = newUser;
    const { permission } = await addRootBlock(newUser, req);
    newUser.permissions.push(permission);
    await newUser.save();
    return {
      user: newUser,
      token: newToken(newUser)
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        errors: [{ field: "email", message: "email address is not available." }]
      };
    }

    console.error(error);
    return { errors: [{ field: "error", message: "server error" }] };
  }
}

module.exports = {
  signup
};
