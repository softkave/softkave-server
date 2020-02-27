import Joi, { Schema as JoiSchema, ValidationOptions } from "joi";
import get from "lodash/get";
import { InvalidInputError } from "./errors";
import { joiErrorMessages } from "./joiError";
import logger from "./logger";

const typePath = "details.0.type";
const pathPath = "details.0.path";

export function validate<DataType>(
  data: DataType,
  schema: JoiSchema,
  options?: ValidationOptions
): DataType {
  const { error, value } = Joi.validate(data, schema, {
    abortEarly: false,
    convert: true,
    ...options
  });

  if (error) {
    logger.info(error);

    const errorArray = [];
    const type = get(error, typePath);
    let path = get(error, pathPath);
    path = path.join(".");
    const func = get(joiErrorMessages, type);

    if (typeof func === "function") {
      const message = func(error);
      errorArray.push(new InvalidInputError({ message, field: path }));
    } else {
      errorArray.push(new InvalidInputError({ field: path }));
    }

    throw errorArray;
  }

  return value;
}
