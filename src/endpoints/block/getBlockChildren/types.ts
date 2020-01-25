import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { BlockType, IBlock } from "mongo/block";

export interface IGetBlockChildrenParameters {
  blockID: string;
  typeList?: BlockType[];
}

export interface IGetBlockChildrenContext extends IBaseEndpointContext {
  data: IGetBlockChildrenParameters;
  getBlockChildrenFromDatabase: (
    blockID: string,
    typeList: BlockType[]
  ) => Promise<IBlock[]>;
}

export interface IGetBlockChildrenResult {
  blocks: IBlock[];
}
