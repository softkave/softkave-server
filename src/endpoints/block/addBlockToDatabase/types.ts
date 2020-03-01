import { IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";
import { IBlockExistsParameters } from "../blockExists/types";
import { INewBlockInput } from "../types";

export interface IAddBlockToDatabaseParameters {
  block: INewBlockInput;
}

export interface IAddBlockToDatabaseContext extends IBaseEndpointContext {
  data: IAddBlockToDatabaseParameters;
  saveBlock: (block: IBlock) => Promise<IBlock>;
  doesBlockExist: (block: IBlockExistsParameters) => Promise<boolean>;
}

export interface IAddBlockToDatabaseResult {
  block: IBlock;
}
