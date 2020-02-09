import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";

export interface IGetBlocksWithCustomIDsParameters {
  customIDs: string[];
}

export interface IGetBlocksWithCustomIDsContext extends IBaseEndpointContext {
  data: IGetBlocksWithCustomIDsParameters;
}

export interface IGetBlocksWithCustomIDsResult {
  blocks: IBlock[];
}
