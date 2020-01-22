import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import {
  IChangePasswordWithTokenContext,
  IChangePasswordWithTokenParameters
} from "./types";

export interface IChangePasswordWithTokenContextParameters
  extends IBaseEndpointContextParameters {
  data: IChangePasswordWithTokenParameters;
}

export default class ChangePasswordWithTokenContext extends BaseEndpointContext
  implements IChangePasswordWithTokenContext {
  public data: IChangePasswordWithTokenParameters;

  constructor(p: IChangePasswordWithTokenContextParameters) {
    super(p);
    this.data = p.data;
  }

  public changePassword() {}
}
