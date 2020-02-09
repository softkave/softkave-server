import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";
import { INewBlockInput } from "../types";

export interface IAddBlockParameters {
  block: INewBlockInput;
}

export interface IAddBlockContext extends IBaseEndpointContext {
  data: IAddBlockParameters;
  addBlockToStorage: (newBlock: INewBlockInput) => Promise<IBlock>;
}

export interface IAddBlockResult {
  block: IBlock;
}
