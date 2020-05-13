import { BlockType, IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IGetBlockChildrenParameters {
  customId: string;
  typeList?: BlockType[];
  useBoardId?: boolean;
}

export interface IGetBlockChildrenContext extends IBaseEndpointContext {
  data: IGetBlockChildrenParameters;
  getBlockChildrenFromDatabase: (
    customId: string,
    typeList: BlockType[],
    useBoardId?: boolean
  ) => Promise<IBlock[]>;
}

export interface IGetBlockChildrenResult {
  blocks: IBlock[];
}
