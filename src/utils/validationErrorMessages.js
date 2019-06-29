const { RequestError } = require("./error");

const errorMessages = {
  dataInvalid: "Input is invalid",
  requiredError: "Field is required",
  notUniqueError: "Input is not unique",
  invalidColor: "Color data is invalid"
};

const errorFields = {};

const errors = {};

module.exports = {
  errors,
  errorFields,
  errorMessages
};
