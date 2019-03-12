const userModel = require("../mongo/user");
const argon2 = require("argon2");
const newToken = require("./newToken");
const {
  validateUser
} = require("./validator");
const addBlockTodDb = require("../block/addBlockToDb");
const randomColor = require("randomcolor");
const {
  orgActions
} = require("../block/actions")
const {
  trimObject
} = require("../utils");

const rootBlockRoles = [{
  role: "admin",
  hierarchy: 1
}, {
  role: "public",
  hierarchy: 0
}];

const rootBlockAcl = orgActions.map(action => {
  return {
    action,
    roles: ["admin"]
  }
});

async function addRootBlock(user, req) {
  let rootBlock = {
    name: `root_${user._id}`,
    createdAt: Date.now(),
    color: randomColor(),
    type: "root",
    createdBy: user._id,
    acl: rootBlockAcl,
    roles: rootBlockRoles,
    role: rootBlockRoles[0]
  };

  await addBlockTodDb(rootBlock, req);

  return {
    role: role
  };
}

async function signup({
  user
}, req) {
  await validateUser(user);
  trimObject(user);

  try {
    user.email = user.email.toLowerCase();
    user.hash = await argon2.hash(user.password);
    let newUser = new userModel.model(user);
    newUser = await newUser.save();

    // for getUserFromReq, it caches user data in fetchedUser
    req.user = newUser;
    req.fetchedUser = newUser;

    const {
      role
    } = await addRootBlock(newUser, req);
    newUser.roles.push(role);
    await newUser.save();
    return {
      user: newUser,
      token: newToken(newUser)
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        errors: [{
          field: "email",
          message: "email address is not available."
        }]
      };
    }

    console.error(error);
    return {
      errors: [{
        field: "error",
        message: "server error"
      }]
    };
  }
}

module.exports = signup;