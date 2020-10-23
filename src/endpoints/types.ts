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
