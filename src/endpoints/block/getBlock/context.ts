import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { IAddBlockContext, IAddBlockParameters } from "./types";

export interface IAddBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: IAddBlockParameters;
}

export default class AddBlockContext extends BaseEndpointContext
  implements IAddBlockContext {
  public data: IAddBlockParameters;

  constructor(p: IAddBlockContextParameters) {
    super(p);
    this.data = p.data;
  }
}
