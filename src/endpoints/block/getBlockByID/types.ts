import { IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IGetBlockByIDParameters {
  customId: string;
}

export interface IGetBlockByIDContext extends IBaseEndpointContext {
  data: IGetBlockByIDParameters;
}

export interface IGetBlockByIDResult {
  block: IBlock;
}
