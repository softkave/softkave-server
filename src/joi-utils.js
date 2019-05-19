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

  return `data must be at least ${min} in length`;
}

function maxErrorMessage(error) {
  const limitPath = "details.0.context.limit";
  const labelPath = "details.0.context.label";
  const max = get(error, limitPath);
  const label = get(error, labelPath);

  if (!max || !label) {
    return defaultErrorMessage();
  }

  return `data must be less than ${max}`;
}

function uniqueErrorMessage() {
  return "data is not unique";
}

function emailErrorMessage() {
  return "input is not a valid email address";
}

const errorMessages = {
  "any.required": requiredErrorMessage,
  "any.empty": requiredErrorMessage,
  "any.allowOnly": defaultErrorMessage,
  "string.base": defaultErrorMessage,
  "string.min": minErrorMessage,
  "string.max": maxErrorMessage,
  "string.regex.base": defaultErrorMessage,
  "string.email": emailErrorMessage,
  "string.guid": defaultErrorMessage,
  "number.base": defaultErrorMessage,
  "number.min": minErrorMessage,
  "number.max": maxErrorMessage,
  "array.base": defaultErrorMessage,
  "array.unique": uniqueErrorMessage,
  "array.min": minErrorMessage,
  "array.max": maxErrorMessage
};

exports.validate = function validate(data, schema) {
  const { error, value } = Joi.validate(data, schema, {
    abortEarly: false,
    convert: true
  });

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

    console.log(errMessages);
    throw errMessages[0];
  }

  return value;
};
