import { noop } from "lodash";
import OperationError from "../utilities/OperationError";
import { IUpdateItemById } from "../utilities/types";
import { IBaseContext } from "./contexts/BaseContext";
import RequestData from "./RequestData";

export interface IBaseEndpointResult {
    errors?: OperationError[];
}

export type Endpoint<
    C extends IBaseContext = IBaseContext,
    T = any,
    R = any
> = (
    context: C,
    instData: RequestData<T>
) => Promise<(R & IBaseEndpointResult) | undefined>;

export type ExtractFieldTransformer<T, Result = any, ExtraArgs = any> = (
    val: T,
    extraArgs: ExtraArgs
) => Result;

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
    ScalarTypes = ExtractFieldsDefaultScalarTypes,
    ExtraArgs = undefined,
    Result extends Partial<Record<keyof T, any>> = T
> = {
    [Key in keyof Required<T>]: T[Key] extends ScalarTypes
        ? boolean | ExtractFieldTransformer<T[Key], Result[Key], ExtraArgs>
        : T[Key] extends any[]
        ? T[Key][0] extends ScalarTypes
            ? boolean | ExtractFieldTransformer<T[Key], Result[Key], ExtraArgs>
            : T[Key][0] extends object
            ? ExtractFieldsFrom<T[Key][0]>
            :
                  | boolean
                  | ExtractFieldTransformer<T[Key][0], Result[Key], ExtraArgs>
        : T[Key] extends object
        ? ExtractFieldsFrom<T[Key]>
        : boolean | ExtractFieldTransformer<T[Key], Result[Key], ExtraArgs>;
};

export interface IObjectPaths<
    T extends object,
    ExtraArgs = undefined,
    Result extends Partial<Record<keyof T, any>> = T
> {
    object: T;
    extraArgs: ExtraArgs;
    result: Result;
    scalarFields: string[];
    scalarFieldsWithTransformers: Array<{
        property: string;
        transformer: ExtractFieldTransformer<any>;
    }>;
    objectFields: Array<{
        property: string;
        fields: IObjectPaths<any>;
    }>;
}

export enum JWTEndpoints {
    ChangePassword = "change-password",
    Login = "login",
    Universal = "*",
}

export enum ServerRecommendedActions {
    LOGIN_AGAIN = "LOGIN_AGAIN",
    LOGOUT = "LOGOUT",
}

export interface IUpdateComplexTypeArrayInput<T> {
    add?: T[];
    remove?: string[];
    update?: Array<IUpdateItemById<T>>;
}
