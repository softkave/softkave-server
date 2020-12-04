import { AnyFn } from "../utilities/types";

export function logScriptStarted(fn: AnyFn) {
    console.log(`script ${fn.name}: started`);
}

export function logScriptSuccessful(fn: AnyFn) {
    console.log(`script ${fn.name}: succeeded`);
}

export function logScriptFailed(fn: AnyFn, error?: Error) {
    console.log(`script ${fn.name}: failed`);

    if (error) {
        console.error(error);
    }
}
