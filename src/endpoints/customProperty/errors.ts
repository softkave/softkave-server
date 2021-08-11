import OperationError from "../../utilities/OperationError";

export class CustomPropertyExistsError extends OperationError {
    public name = "CustomPropertyExistsError";
    public message = "Custom property exists";
}

// tslint:disable-next-line: max-classes-per-file
export class CustomPropertyDoesNotExistError extends OperationError {
    public name = "CustomPropertyDoesNotExistError";
    public message = "Custom property does not exist";
}

export class CustomPropertyValueExistsError extends OperationError {
    public name = "CustomPropertyValueExistsError";
    public message = "Custom property value exists";
}

// tslint:disable-next-line: max-classes-per-file
export class CustomPropertyValueDoesNotExistError extends OperationError {
    public name = "CustomPropertyValueDoesNotExistError";
    public message = "Custom property value does not exist";
}

export class CustomSelectionOptionExistsError extends OperationError {
    public name = "CustomSelectionOptionExistsError";
    public message = "Custom selection option exists";
}

// tslint:disable-next-line: max-classes-per-file
export class CustomSelectionOptionDoesNotExistError extends OperationError {
    public name = "CustomSelectionOptionDoesNotExistError";
    public message = "Custom selection option does not exist";
}
