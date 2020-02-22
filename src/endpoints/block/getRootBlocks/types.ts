import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";

export interface IGetRootBlocksContext extends IBaseEndpointContext {
  getRootBlocksFromStorage: () => Promise<IBlock[]>;
}

export interface IGetRootBlocksResult {
  blocks: IBlock[];
}
