const notification = require("./notificationErrorMessages");
const server = require("./serverErrorMessages");
const user = require("./userErrorMessages");
const validation = require("./validationErrorMessages");
const block = require("./blockErrorMessages");

const errorMessages = {
  notification: notification.errorMessages,
  server: server.errorMessages,
  user: user.errorMessages,
  validation: validation.errorMessages,
  block: block.errorMessages
};

const errorFields = {
  notification: notification.errorFields,
  server: server.errorFields,
  user: user.errorFields,
  validation: validation.errorFields,
  block: block.errorFields
};

const errors = {
  notification: notification.errors,
  server: server.errors,
  user: user.errors,
  validation: validation.errors,
  block: block.errors
};

module.exports = {
  errors,
  errorFields,
  errorMessages
};
