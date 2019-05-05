const get = require("lodash/get");
const Joi = require("joi");
const { RequestError } = require("./error");

module.exports = exports;

function defaultErrorMessage() {
  return "data is invalid";
}

function requiredErrorMessage() {
  return "field is required";
}

function minErrorMessage(error) {
  const limitPath = "details.0.context.limit";
  const labelPath = "details.0.context.label";
  const min = get(error, limitPath);
  const label = get(error, labelPath);

  if (!min || !label) {
    return defaultErrorMessage();
  }

  return `${label} length must be at least ${min} character(s) long`;
}

function maxErrorMessage(error) {
  const limitPath = "details.0.context.limit";
  const labelPath = "details.0.context.label";
  const max = get(error, limitPath);
  const label = get(error, labelPath);

  if (!max || !label) {
    return defaultErrorMessage();
  }

  return `${label} length must be less than or equal to ${max} character(s) long`;
}

const errorMessages = {
  "any.required": requiredErrorMessage,
  "any.empty": requiredErrorMessage,
  "string.min": minErrorMessage,
  "string.max": maxErrorMessage,
  "string.regex.base": defaultErrorMessage,
  "string.email": null
};

exports.validate = function validate(data, schema) {
  const { error, value } = Joi.validate(data, schema);

  if (error) {
    let errMessages = [];
    const typePath = "details.0.type";
    const pathPath = "details.0.path";
    const type = get(error, typePath);
    let path = get(error, pathPath);
    path = Array(path).join(".");
    const func = get(errorMessages, type);

    if (typeof func === "function") {
      const message = func(error);
      errMessages.push(new RequestError(path, message));
    } else {
      errMessages.push(new RequestError(path, defaultErrorMessage()));
    }

    throw errMessages;
  }

  return value;
};
