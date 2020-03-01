import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";
import { INewBlockInput } from "../types";

export interface ICreateRootBlockParameters {
  user: IUser;
}

export interface ICreateRootBlockContext extends IBaseEndpointContext {
  data: ICreateRootBlockParameters;
  addBlockToStorage: (newBlock: INewBlockInput) => Promise<IBlock>;
}

export interface ICreateRootBlockResult {
  block: IBlock;
}
