import { Schema as JoiSchema, ValidationOptions } from "joi";
import { InvalidInputError } from "./errors";

export function validate<DataType>(
    data: DataType,
    schema: JoiSchema,
    options?: ValidationOptions
): DataType {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        convert: true,
        ...options,
    });

    if (error) {
        console.log(error);
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
