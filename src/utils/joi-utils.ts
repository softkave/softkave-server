import Joi, { JoiObject, Schema as JoiSchema } from "joi";
import get from "lodash/get";

import { joiErrorMessages } from "./joiError";
import OperationError from "./OperationError";
import {
  validationErrorFields,
  validationErrorMessages
} from "./validationError";

const typePath = "details.0.type";
const pathPath = "details.0.path";

// TODO: define all any types
function validate<DataType>(data: DataType, schema: JoiSchema): DataType {
  const { error, value } = Joi.validate(data, schema, {
    abortEarly: false,
    convert: true
  });

  if (error) {
    console.log({ error });
    const errorArray = [];
    const type = get(error, typePath);
    let path = get(error, pathPath);
    path = path.join(".");
    const func = get(joiErrorMessages, type);

    if (typeof func === "function") {
      const message = func(error);
      errorArray.push(
        new OperationError(validationErrorFields.dataInvalid, message, path)
      );
    } else {
      errorArray.push(
        new OperationError(
          validationErrorFields.dataInvalid,
          validationErrorMessages.dataInvalid,
          path
        )
      );
    }

    throw errorArray;
  }

  return value;
}

export { validate };
