const get = require("lodash/get");
const Joi = require("joi");

const { RequestError } = require("./error");
const { joiErrorMessages } = require("./joiErrorMessages");
const {
  errorMessages: validationErrorMessages
} = require("./validationErrorMessages");

const typePath = "details.0.type";
const pathPath = "details.0.path";

function validate(data, schema) {
  const { error, value } = Joi.validate(data, schema, {
    abortEarly: false,
    convert: true
  });

  if (error) {
    let errorArray = [];
    const type = get(error, typePath);
    let path = get(error, pathPath);
    path = Array(path).join(".");
    const func = get(joiErrorMessages, type);

    if (typeof func === "function") {
      const message = func(error);
      errorArray.push(new RequestError(path, message));
    } else {
      errorArray.push(
        new RequestError(path, validationErrorMessages.dataInvalid)
      );
    }

    // console.log(validationErrorMessages);
    // throw validationErrorMessages[0];

    return errorArray;
  }

  return value;
}

module.exports = {
  validate
};
