import OperationError from "../../utilities/OperationError";

export const notImplementFn = (() => {
    throw new Error("Not implemented");
}) as any;

export const testNoop = (() => {}) as any;

export function findErrorByName(errors: OperationError[], name: string) {
    return errors.find((error) => error.name === name);
}
