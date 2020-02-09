import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { BlockType } from "mongo/block";

export interface IBlockExistsParameters {
  name: string;
  type: BlockType;
  parent: string;
}

export interface IBlockExistsContext extends IBaseEndpointContext {
  data: IBlockExistsParameters;
  doesBlockExistInStorage: (p: IBlockExistsParameters) => Promise<boolean>;
}
