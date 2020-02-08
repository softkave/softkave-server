import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import changePassword from "../changePassword/changePassword";
import ChangePasswordContext from "../changePassword/context";
import { IChangePasswordParameters } from "../changePassword/types";
import { IChangePasswordWithTokenContext } from "./types";

export interface IChangePasswordWithTokenContextParameters
  extends IBaseEndpointContextParameters {
  data: IChangePasswordParameters;
}

export default class ChangePasswordWithTokenContext extends BaseEndpointContext
  implements IChangePasswordWithTokenContext {
  public data: IChangePasswordParameters;

  constructor(p: IChangePasswordWithTokenContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async changePassword(password: string) {
    return changePassword(
      new ChangePasswordContext({
        req: this.req,
        blockModel: this.blockModel,
        data: { password },
        notificationModel: this.notificationModel,
        userModel: this.userModel
      })
    );
  }
}
