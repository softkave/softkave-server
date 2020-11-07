import { pick } from "lodash";
import isArray from "lodash/isArray";
import isDate from "lodash/isDate";
import isFunction from "lodash/isFunction";
import isNull from "lodash/isNull";
import isObject from "lodash/isObject";
import { ExtractFieldsFrom, IObjectPaths } from "./types";

export const wrapEndpoint = async (data: any, req: any, endpoint: any) => {
    try {
        return await endpoint(data, req);
    } catch (error) {
        const errors = Array.isArray(error) ? error : [error];
        console.error(error);
        return {
            errors: errors.map((err) => ({
                name: err.name,
                message: err.message,
                action: err.action,
                field: err.field,
            })),
        };
    }
};

export const fireAndForgetFn = async <Fn extends (...args: any) => any>(
    fn: Fn,
    ...args: Array<Parameters<Fn>>
): Promise<ReturnType<Fn>> => {
    try {
        return await fn(...args);
    } catch (error) {
        console.error(error);
    }
};

export const fireAndForgetPromise = async <T>(promise: Promise<T>) => {
    try {
        return await promise;
    } catch (error) {
        console.error(error);
    }
};

export function getFields<T extends object>(
    data: ExtractFieldsFrom<T>
): IObjectPaths<T> {
    const keys = Object.keys(data);

    return keys.reduce(
        (paths, key) => {
            const value = data[key];

            if (!isNull(value) && isObject(value) && !isDate(value)) {
                paths.objectFields.push({
                    property: key,
                    fields: getFields(value as any),
                });
            } else if (isFunction(value)) {
                paths.scalarFieldsWithTransformers.push({
                    property: key,
                    transformer: value,
                });
            } else {
                paths.scalarFields.push(key);
            }

            return paths;
        },
        {
            scalarFields: [],
            scalarFieldsWithTransformers: [],
            objectFields: [],
            object: ({} as unknown) as T,
        } as IObjectPaths<T>
    );
}

export function extractFields<
    T extends object = object,
    Result extends object = object
>(data: T, paths: IObjectPaths<Result>): Result {
    const result = pick(data, paths.scalarFields);

    paths.scalarFieldsWithTransformers.forEach(({ property, transformer }) => {
        const propValue = data[property];

        // TODO: if you ever update this to allow null,
        // make sure to strip those fields in the Joi schema
        if (!propValue) {
            return;
        }

        result[property] = transformer(propValue);
    });

    paths.objectFields.forEach(({ property, fields }) => {
        const propValue = data[property];

        // TODO: if you ever update this to allow null,
        // make sure to strip those fields in the Joi schema
        if (!propValue) {
            return;
        }

        result[property] = isArray(propValue)
            ? propValue.map((value) => extractFields(value, fields))
            : extractFields(propValue, fields);
    });

    return (result as unknown) as Result;
}
