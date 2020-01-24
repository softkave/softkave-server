import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { IAddBlockParameters, ICreateRootBlockContext } from "./types";

export interface ICreateRootBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: IAddBlockParameters;
}

export default class CreateRootBlockContext extends BaseEndpointContext
  implements ICreateRootBlockContext {
  public data: IAddBlockParameters;

  constructor(p: ICreateRootBlockContextParameters) {
    super(p);
    this.data = p.data;
  }
}
