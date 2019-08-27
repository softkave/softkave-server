const validationErrorMessages = {
  dataInvalid: "Input is invalid",
  requiredError: "Field is required",
  notUniqueError: "Input is not unique",
  invalidColor: "Color data is invalid"
};

// TODO: think on "sys.validation.di" maybe use abbreviations on error codes, like
// TODO: "02344" or something for the error fields
// TODO: convert the name from fields to type
const validationErrorFields = {
  dataInvalid: "system.validation.dataInvalid",
  invalidColor: "system.validation.invalidColor"
};

const validationError = {};

function getErrorMessageWithMin(min: number, type: string) {
  switch (type) {
    case "number":
      return `Input must be less than ${min}`;

    case "string":
      return `Input must be at least ${min} characters`;

    case "array":
      return `Input must contain at least ${min} items`;

    default:
      return `Input must be at least ${min} in length`;
  }
}

function getErrorMessageWithMax(max: number, type: string) {
  switch (type) {
    case "number":
      return `Input must be greater than ${max}`;

    case "string":
      return `Input must be more than ${max} characters`;

    case "array":
      return `Input must be more than ${max} items`;

    default:
      return `Input must be more than ${max}`;
  }
}

export default validationError;
export {
  validationErrorFields,
  validationErrorMessages,
  getErrorMessageWithMin,
  getErrorMessageWithMax
};
