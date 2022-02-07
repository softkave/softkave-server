import assert from "assert";
import OperationError from "../../utilities/OperationError";
import { IBaseEndpointResult } from "../types";

export const notImplementFn = (() => {
    throw new Error("Not implemented");
}) as any;

export const testNoop = (() => {}) as any;

export function findErrorByName(errors: OperationError[], name: string) {
    return errors.find((error) => error.name === name);
}

export function assertResultOk(result: IBaseEndpointResult) {
    if (result?.errors) {
        throw result.errors;
    }
}
