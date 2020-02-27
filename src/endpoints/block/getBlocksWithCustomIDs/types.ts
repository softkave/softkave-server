import { IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IGetBlocksWithCustomIDsParameters {
  customIds: string[];
}

export interface IGetBlocksWithCustomIDsContext extends IBaseEndpointContext {
  data: IGetBlocksWithCustomIDsParameters;
}

export interface IGetBlocksWithCustomIDsResult {
  blocks: IBlock[];
}
