import { IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IGetRootBlocksContext extends IBaseEndpointContext {
  getRootBlocksFromStorage: () => Promise<IBlock[]>;
}

export interface IGetRootBlocksResult {
  blocks: IBlock[];
}
