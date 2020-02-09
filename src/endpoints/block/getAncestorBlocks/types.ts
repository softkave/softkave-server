import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";

export interface IGetAncestorBlocksContext extends IBaseEndpointContext {
  getAncestorBlocksFromStorage: () => Promise<IBlock[]>;
}

export interface IGetAncestorBlocksResult {
  blocks: IBlock[];
}
