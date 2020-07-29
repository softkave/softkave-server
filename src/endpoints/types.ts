import OperationError from "../utilities/OperationError";
import BaseContext from "./contexts/BaseContext";
import RequestData from "./contexts/RequestData";

export interface IBaseEndpointResult {
  errors?: OperationError[];
}

export type Endpoint<C extends BaseContext = BaseContext, T = any, R = any> = (
  context: C,
  instData: RequestData<T>
) => Promise<(R & IBaseEndpointResult) | undefined>;
