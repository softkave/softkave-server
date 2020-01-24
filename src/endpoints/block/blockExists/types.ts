import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { BlockType, IBlock } from "mongo/block";

export interface IBlockExistsParameters {
  blockName: string;
  blockType: BlockType;
  blockParents: string[];
}

export interface IBlockExistsContext extends IBaseEndpointContext {
  data: IBlockExistsParameters;
  doesBlockInDatabase: (p: IBlockExistsParameters) => Promise<boolean>;
}

export interface IBlockExistsResult {
  block: IBlock;
}
