import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";

export interface IGetBlockByIDParameters {
  customId: string;
}

export interface IGetBlockByIDContext extends IBaseEndpointContext {
  data: IGetBlockByIDParameters;
}

export interface IGetBlockByIDResult {
  block: IBlock;
}
