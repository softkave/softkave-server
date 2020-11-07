import OperationError from "../utilities/OperationError";
import { IBaseContext } from "./contexts/BaseContext";
import RequestData from "./contexts/RequestData";

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

export type ExtractFieldTransformer<T, Result = any> = (val: T) => Result;

export type ExtractFieldsFrom<T extends object> = {
    [Key in keyof Required<T>]: T[Key] extends Date
        ? boolean | ExtractFieldTransformer<Date>
        : T[Key] extends any[]
        ? T[Key][0] extends Date
            ? boolean | ExtractFieldTransformer<Date>
            : T[Key][0] extends object
            ? ExtractFieldsFrom<T[Key][0]>
            : boolean | ExtractFieldTransformer<T[Key][0]>
        : T[Key] extends object
        ? ExtractFieldsFrom<T[Key]>
        : boolean | ExtractFieldTransformer<T[Key]>;
};

export interface IObjectPaths<O extends object> {
    object: O;
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
}

export enum ServerRecommendedActions {
    LOGIN_AGAIN = "LOGIN_AGAIN",
    LOGOUT = "LOGOUT",
}
