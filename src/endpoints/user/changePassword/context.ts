import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { IChangePasswordContext, IChangePasswordParameters } from "./types";

export interface IChangePasswordContextParameters
  extends IBaseEndpointContextParameters {
  data: IChangePasswordParameters;
}

export default class ChangePasswordContext extends BaseEndpointContext
  implements IChangePasswordContext {
  public data: IChangePasswordParameters;

  constructor(p: IChangePasswordContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async saveUserPasswordHash(hash: string) {
    await this.updateUser({ hash });
  }
}
