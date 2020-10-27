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

export type GetFields<T extends object> = {
    [K in keyof Required<T>]: T[K] extends Date
        ? boolean
        : T[K] extends any[]
        ? T[K][0] extends Date
            ? boolean
            : T[K][0] extends object
            ? GetFields<T[K][0]>
            : boolean
        : T[K] extends object
        ? GetFields<T[K]>
        : boolean;
};

export interface IObjectPaths<O extends object> {
    object: O;
    stringFields: string[];
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
    LoginAgain = "login-again",
}
