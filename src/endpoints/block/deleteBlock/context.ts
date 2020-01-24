import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { IDeleteBlockContext, IDeleteBlockParameters } from "./types";

export interface IDeleteBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: IDeleteBlockParameters;
}

export default class DeleteBlockContext extends BaseEndpointContext
  implements IDeleteBlockContext {
  public data: IDeleteBlockParameters;

  constructor(p: IDeleteBlockContextParameters) {
    super(p);
    this.data = p.data;
  }
}
