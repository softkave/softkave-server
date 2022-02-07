import { pick, isArray, isFunction, isNull, isObject, isDate } from "lodash";
import { Request, Response } from "express";
import { ParentResourceType, SystemResourceType } from "../models/system";
import mongoConstants from "../mongo/constants";
import { IParentInformation } from "../mongo/definitions";
import { ServerError } from "../utilities/errors";
import { cast, indexArray } from "../utilities/fns";
import { ConvertDatesToStrings } from "../utilities/types";
import { IBaseContext } from "./contexts/IBaseContext";
import { IServerRequest } from "./contexts/types";
import RequestData from "./RequestData";
import {
    Endpoint,
    ExtractFieldsDefaultScalarTypes,
    ExtractFieldsFrom,
    IObjectPaths,
    IUpdateComplexTypeArrayInput,
} from "./types";
import OperationError from "../utilities/OperationError";

export const fireAndForgetFn = <Fn extends (...args: any) => any>(
    fn: Fn,
    ...args: Array<Parameters<Fn>>
): void => {
    setTimeout(async () => {
        try {
            await fn(...args);
        } catch (error) {
            console.error(error);
        }
    }, 5);
};

export const fireAndForgetPromise = async <T>(promise: Promise<T>) => {
    try {
        return await promise;
    } catch (error) {
        console.error(error);
    }
};

export const wrapFireAndThrowErrorAsync = <Fn extends (...args: any) => any>(
    fn: Fn,
    throwError = true
): Fn => {
    return cast<Fn>(async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error(error);

            if (throwError) {
                throw error;
            }
        }
    });
};

export const wrapFireAndThrowErrorRegular = <Fn extends (...args: any) => any>(
    fn: Fn,
    throwError = true
): Fn => {
    return cast<Fn>((...args) => {
        try {
            return fn(...args);
        } catch (error) {
            console.error(error);

            if (throwError) {
                throw error;
            }
        }
    });
};

export const wrapFireAndDontThrowAsync: typeof wrapFireAndThrowErrorAsync = (
    fn
) => {
    return wrapFireAndThrowErrorAsync(fn, false);
};

export async function tryCatch<T extends (...args: any) => any>(
    fn: T
): Promise<ReturnType<T> | null> {
    try {
        return await fn();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function getFields<
    T extends object,
    ScalarTypes = ExtractFieldsDefaultScalarTypes,
    ExtraArgs = any,
    Result extends Partial<Record<keyof T, any>> = T
>(
    data: ExtractFieldsFrom<T, ScalarTypes, ExtraArgs, Result>
): IObjectPaths<T, ExtraArgs, Result> {
    const keys = Object.keys(data);

    return keys.reduce(
        (paths, key) => {
            const value = data[key];

            if (isFunction(value)) {
                paths.scalarFieldsWithTransformers.push({
                    property: key,
                    transformer: value,
                });
            } else if (!isNull(value) && isObject(value) && !isDate(value)) {
                paths.objectFields.push({
                    property: key,
                    fields: getFields(value as any),
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
            object: cast<T>({}),
            extraArgs: cast<ExtraArgs>({}),
            result: cast<Result>({}),
        } as IObjectPaths<T, ExtraArgs, Result>
    );
}

export function extractFields<
    ObjectPaths extends IObjectPaths<any, any, any>,
    Data extends Partial<
        Record<keyof ObjectPaths["object"], any>
    > = ObjectPaths["object"]
>(
    data: Data,
    paths: ObjectPaths,
    extraArgs?: ObjectPaths["extraArgs"]
): ObjectPaths["result"] {
    const result = pick(data, paths.scalarFields);

    paths.scalarFieldsWithTransformers.forEach(({ property, transformer }) => {
        const propValue = data[property];

        if (propValue === undefined) {
            return;
        }

        result[property] =
            propValue === null ? null : transformer(propValue, extraArgs);
    });

    paths.objectFields.forEach(({ property, fields }) => {
        const propValue = data[property];

        if (propValue === undefined) {
            return;
        }

        result[property] = isArray(propValue)
            ? propValue.map((value) => extractFields(value, fields, extraArgs))
            : propValue === null
            ? null
            : extractFields(propValue, fields, extraArgs);
    });

    return result as unknown as ObjectPaths["result"];
}

export function getComplexTypeArrayInput<T>(
    input: IUpdateComplexTypeArrayInput<T>,
    indexPath: T extends object ? keyof T : never
): IUpdateComplexTypeArrayInput<T> & {
    addMap: {
        [key: string]: IUpdateComplexTypeArrayInput<T>["add"][0];
    };
    updateMap: {
        [key: string]: IUpdateComplexTypeArrayInput<T>["update"][0];
    };
    removeMap: {
        [key: string]: IUpdateComplexTypeArrayInput<T>["remove"][0];
    };
} {
    return {
        add: input.add || [],
        remove: input.remove || [],
        update: input.update || [],
        addMap: indexArray(input.add || [], { path: indexPath }),
        updateMap: indexArray(input.update || [], { path: indexPath }),
        removeMap: indexArray(input.remove || []),
    };
}

// TODO: internal/nested docs with customId or unique indexes should be validated before call
// TODO: It's possible that the unique error may be from another field, and not customId.
// how do we handle that?
export async function saveNewItemToDb<Fn extends (...args: any) => any>(
    saveFn: Fn
): Promise<ReturnType<Fn>> {
    let tryAgain = false;

    do {
        try {
            const doc = await saveFn();
            return doc;
        } catch (error) {
            console.error(error);

            // Adding a resource fails with code 11000 if unique fields like customId
            if (error.code === mongoConstants.indexNotUniqueErrorCode) {
                // Retry once, and throw error if it occurs again
                if (!tryAgain) {
                    tryAgain = true;
                    continue;
                } else {
                    tryAgain = false;
                }
            }

            console.error(error);
            throw new ServerError();
        }
    } while (tryAgain);
}

export function getComplexTypeArrayInputGraphQLSchema(
    inputName: string,
    type: string
) {
    return `
        input ${inputName} {
            add: [${type}]
            update: [${type}]
            remove: [String]
        }
    `;
}

const publicParentInformationFields = getFields<IParentInformation>({
    type: true,
    customId: true,
});

export type IPublicParentInformation = ConvertDatesToStrings<{
    type: ParentResourceType;
    customId: string;
}>;

export function getPublicParentInformation(
    parent: IParentInformation
): IPublicParentInformation {
    return extractFields(parent, publicParentInformationFields);
}

export function getPublicParentInformationArray(
    parents: IParentInformation[]
): IPublicParentInformation[] {
    return parents.map((parent) =>
        extractFields(parent, publicParentInformationFields)
    );
}

export function getParentIndexByType(
    parents: IParentInformation[],
    type: ParentResourceType
) {
    return parents.findIndex((parent) => parent.type === type);
}

export function getParentByType(
    parents: IParentInformation[],
    type: ParentResourceType
) {
    return parents.find((parent) => parent.type === type);
}

export function assertGetParentIndexByType(
    resourceId: string,
    resourceType: SystemResourceType,
    parents: IParentInformation[],
    type: ParentResourceType
) {
    const index = parents.findIndex((parent) => parent.type === type);

    if (index === -1) {
        console.error(
            `${resourceType}:${resourceId} parent of type ${type} not found`
        );

        throw new ServerError();
    }

    return index;
}

export function assertGetParentByType(
    resourceId: string,
    resourceType: SystemResourceType,
    parents: IParentInformation[],
    type: ParentResourceType
) {
    const parent = parents.find((parent) => parent.type === type);

    if (!parent) {
        console.error(
            `${resourceType}:${resourceId} parent of type ${type} not found`
        );

        throw new ServerError();
    }

    return parent;
}

// TODO: there are two wrap endpoints, find a fix
export const wrapEndpointREST = <
    Context extends IBaseContext,
    EndpointType extends Endpoint<Context>
>(
    endpoint: EndpointType,
    context: Context,
    handleResponse?: (
        res: Response,
        result: Awaited<ReturnType<EndpointType>>
    ) => void
): ((req: Request, res: Response) => any) => {
    return async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const instData = RequestData.fromExpressRequest(
                context,
                req as unknown as IServerRequest,
                data
            );

            const result = await endpoint(context, instData);

            if (handleResponse) {
                handleResponse(res, result);
            } else {
                res.status(200).json(result || {});
            }
        } catch (error) {
            const errors = Array.isArray(error) ? error : [error];

            // TODO: move to winston
            console.error(error);
            console.log(); // for spacing

            // We are mapping errors cause some values don't show if we don't
            // or was it errors, not sure anymore, this is old code.
            // TODO: Feel free to look into it, cause it could help performance.
            const preppedErrors: Omit<OperationError, "isPublic">[] = [];
            cast<OperationError[]>(errors).forEach((err) => {
                if (err.isPublic) {
                    preppedErrors.push({
                        name: err.name,
                        message: err.message,
                        action: err.action,
                        field: err.field,
                    });
                } else {
                    preppedErrors.push(new ServerError());
                }
            });

            const result = {
                errors: preppedErrors,
            };

            res.status(500).json(result);
        }
    };
};
