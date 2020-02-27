import { IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";
import { INewBlockInput } from "../types";

export interface ICreateRootBlockContext extends IBaseEndpointContext {
  addBlockToStorage: (newBlock: INewBlockInput) => Promise<IBlock>;
}

export interface ICreateRootBlockResult {
  block: IBlock;
}
