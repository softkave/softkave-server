import {Schema as JoiSchema, ValidationOptions} from 'joi';
import {isNull, isUndefined} from 'lodash';
import {InvalidInputError} from './errors';

/**
 * Validate data using the provided Joi schema. It also checks for null and
 * undefined by default.
 * @param data
 * @param schema
 * @param options
 * @returns
 */
export function validate<DataType>(
  data: DataType,
  schema: JoiSchema,
  options?: ValidationOptions
): NonNullable<DataType> {
  if (isNull(data) || isUndefined(data)) {
    throw new InvalidInputError('Data not provided');
  }

  const {error, value} = schema.validate(data, {
    abortEarly: false,
    convert: true,
    allowUnknown: false,
    errors: {
      label: false,
    },
    ...options,
  });

  if (error) {
    console.dir(error, {depth: 4});
    const errorArray = error.details.map(err => {
      return new InvalidInputError({
        field: err.path.join('.'),
        message: err.message,
      });
    });

    throw errorArray;
  }

  return value;
}
