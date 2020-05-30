import OperationError from "../utilities/OperationError";
import BaseContext from "./contexts/BaseContext";
import { IEndpointInstanceData } from "./contexts/types";

export interface IBaseEndpointResult {
  errors?: OperationError[];
}

export type Endpoint<
  C extends BaseContext = BaseContext,
  T = any,
  R = any
> = (context: C, instData: IEndpointInstanceData<T>) => Promise<(R & IBaseEndpointResult) | undefined>;
