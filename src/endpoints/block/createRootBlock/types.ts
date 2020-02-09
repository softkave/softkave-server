import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";
import { INewBlockInput } from "../types";

export interface ICreateRootBlockContext extends IBaseEndpointContext {
  addBlockToStorage: (newBlock: INewBlockInput) => Promise<IBlock>;
}

export interface ICreateRootBlockResult {
  block: IBlock;
}
