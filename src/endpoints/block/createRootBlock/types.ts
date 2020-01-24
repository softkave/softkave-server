import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";

export interface ICreateRootBlockContext extends IBaseEndpointContext {
  addBlockToDatabase: () => Promise<void>;
}

export interface ICreateRootBlockResult {
  block: IBlock;
}
