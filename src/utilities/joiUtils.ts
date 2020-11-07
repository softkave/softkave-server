import Joi, { Schema as JoiSchema, ValidationOptions } from "joi";
import { InvalidInputError } from "./errors";
import logger from "./logger";

export function validate<DataType>(
    data: DataType,
    schema: JoiSchema,
    options?: ValidationOptions
): DataType {
    const { error, value } = Joi.validate(data, schema, {
        abortEarly: false,
        convert: true,
        ...options,
    });

    if (error) {
        const errorArray = error.details.map((err) => {
            return new InvalidInputError({
                field: err.path.join("."),
                message: err.message,
            });
        });

        throw errorArray;
    }

    return value;
}
