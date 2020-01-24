import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { IBlockExistsContext, IBlockExistsParameters } from "./types";

export interface IBlockExistsContextParameters
  extends IBaseEndpointContextParameters {
  data: IBlockExistsParameters;
}

export default class BlockExistsContext extends BaseEndpointContext
  implements IBlockExistsContext {
  public data: IBlockExistsParameters;

  constructor(p: IBlockExistsContextParameters) {
    super(p);
    this.data = p.data;
  }
}
