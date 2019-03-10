const asyncValidator = require("async-validator");
const {
  passwordPattern,
  promisifyValidator,
  trimInput
} = require("../validation-utils");
//const isMobilePhone = require('validator/lib/isMobilePhone');

const userDescriptor = {
  name: {
    type: "string",
    message: "name is invalid",
    transform: trimInput
  },
  email: {
    type: "email",
    message: "email is invalid"
  },
  password: {
    type: "string",
    pattern: passwordPattern,
    message: "password is invalid.",
    transform: trimInput
  }
};

const userValidator = new asyncValidator(userDescriptor);
const validateUser = promisifyValidator(userValidator);

module.exports = {
  userDescriptor,
  validateUser
};