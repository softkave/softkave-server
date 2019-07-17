import Joi from "joi";
import get from "lodash/get";

import { joiErrorMessages } from "./joiError";
import RequestError from "./RequestError";
import { validationErrorMessages } from "./validationError";

const typePath = "details.0.type";
const pathPath = "details.0.path";

// TODO: define all any types
function validate(data: any, schema: any) {
  const { error, value } = Joi.validate(data, schema, {
    abortEarly: false,
    convert: true
  });

  if (error) {
    const errorArray = [];
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

    return errorArray;
  }

  return value;
}

export { validate };
