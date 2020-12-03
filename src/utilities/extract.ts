import isFunction from "lodash/isFunction";
import pick from "lodash/pick";
import cast from "./fns";

export type ExtractFieldTransformer<
    T,
    Result = any,
    ExtraArgs = any,
    T1 = object
> = (val: T, extraArgs: ExtraArgs, data: T1) => Result;

export type ExtractFieldsDefaultScalarTypes =
    | undefined
    | boolean
    | string
    | number
    | bigint
    | symbol
    | null
    | Date;

export type ExtractFieldsFrom<
    T extends object,
    Result extends Partial<Record<keyof T, any>> = T,
    ExtraArgs = undefined,
    ScalarTypes = ExtractFieldsDefaultScalarTypes
> = {
    [Key in keyof Required<T>]: T[Key] extends ScalarTypes
        ?
              | boolean
              | ExtractFieldTransformer<
                    NonNullable<Required<T>[Key]>,
                    Required<Result>[Key],
                    ExtraArgs,
                    T
                >
        : ExtractFieldTransformer<
              NonNullable<Required<T>[Key]>,
              Required<Result>[Key],
              ExtraArgs,
              T
          >;
};

export interface IObjectPaths<
    T extends object,
    Result extends Partial<Record<keyof T, any>> = T,
    ExtraArgs = any
> {
    object: T;
    extraArgs: ExtraArgs;
    result: Result;
    scalarFields: string[];
    scalarFieldsWithTransformers: Array<{
        property: string;
        transformer: ExtractFieldTransformer<any>;
    }>;
    finalize?: (data: T, currentResult: Result, extraArgs: ExtraArgs) => Result;
}

export function getFields<
    T extends object,
    Result extends Partial<Record<keyof T, any>> = T,
    ExtraArgs = any,
    ScalarTypes = ExtractFieldsDefaultScalarTypes
>(
    data: ExtractFieldsFrom<T, Result, ExtraArgs, ScalarTypes>,
    finalizeFn?: (
        data: T,
        currentResult: Result,
        extraArgs: ExtraArgs
    ) => Result
): IObjectPaths<T, Result, ExtraArgs> {
    const keys = Object.keys(data);

    return keys.reduce(
        (paths, key) => {
            const value = data[key];

            if (isFunction(value)) {
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
            object: cast<T>({}),
            extraArgs: cast<ExtraArgs>({}),
            result: cast<Result>({}),
            finalize: finalizeFn,
        } as IObjectPaths<T, Result, ExtraArgs>
    );
}

export function extractFields<
    ObjectPaths extends IObjectPaths<any>,
    Data extends Partial<
        Record<keyof ObjectPaths["object"], any>
    > = ObjectPaths["object"]
>(
    data: Data,
    paths: ObjectPaths,
    extraArgs?: ObjectPaths["extraArgs"]
): ObjectPaths["result"] {
    let result = pick(data, paths.scalarFields);

    paths.scalarFieldsWithTransformers.forEach(({ property, transformer }) => {
        const propValue = data[property];

        if (!propValue) {
            return;
        }

        result[property] = transformer(propValue, extraArgs, data);
    });

    if (paths.finalize) {
        result = paths.finalize(data, result, extraArgs);
    }

    return (result as unknown) as ObjectPaths["result"];
}

export function makeExtract<T extends IObjectPaths<any>>(fields: T) {
    const fn = <T1 extends T["object"]>(data: T1) => {
        return extractFields(data, fields);
    };

    return fn;
}

export function makeListExtract<T extends IObjectPaths<any>>(fields: T) {
    const fn = <T1 extends T["object"]>(data: T1[]) => {
        return data.map((datum) => extractFields(datum, fields));
    };

    return fn;
}
