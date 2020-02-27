import { BlockType, IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IBlockExistsParameters {
  name: string;
  type: BlockType;
  parent?: string;
}

export interface IBlockExistsContext extends IBaseEndpointContext {
  data: IBlockExistsParameters;
  getBlockByName: (name: string) => Promise<IBlock>;
}
