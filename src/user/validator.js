const util = require("util");
const asyncValidator = require("async-validator");
const { blockDescriptor, roleDescriptor } = require("../block/validator");
const { passwordPattern, mongoIdDescriptor } = require("../validation-utils");
//const isMobilePhone = require('validator/lib/isMobilePhone');

const userDescriptor = {
  name: { type: "string", message: "name is invalid" },
  email: { type: "string", message: "email is invalid" },
  password: {
    type: "string",
    pattern: passwordPattern,
    message: "password is invalid."
  },
  // permission: [
  //   {
  //     type: "object",
  //     fields: {
  //       role: roleDescriptor.role,
  //       level: roleDescriptor.level,
  //       assignedAt: {
  //         type: "number"
  //       },
  //       assignedBy: mongoIdDescriptor,
  //       type: blockDescriptor.type,
  //       blockId: mongoIdDescriptor
  //     }
  //   }
  // ]
};

const userValidator = new asyncValidator(userDescriptor);
const validateUser = util.promisify(userValidator.validate.bind(userValidator));

module.exports = {
  userDescriptor,
  validateUser
};
