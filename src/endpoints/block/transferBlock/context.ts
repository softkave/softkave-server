import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ITransferBlockContext, ITransferBlockParameters } from "./types";

export interface ITransferBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: ITransferBlockParameters;
}

export default class TransferBlockContext extends BaseEndpointContext
  implements ITransferBlockContext {
  public data: ITransferBlockParameters;

  constructor(p: ITransferBlockContextParameters) {
    super(p);
    this.data = p.data;
  }
}
