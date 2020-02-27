import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { IGetBlockByIDContext, IGetBlockByIDParameters } from "./types";

export interface IGetBlockByIDContextParameters
  extends IBaseEndpointContextParameters {
  data: IGetBlockByIDParameters;
}

export default class GetBlockByIDContext extends BaseEndpointContext
  implements IGetBlockByIDContext {
  public data: IGetBlockByIDParameters;

  constructor(p: IGetBlockByIDContextParameters) {
    super(p);
    this.data = p.data;
  }
}
