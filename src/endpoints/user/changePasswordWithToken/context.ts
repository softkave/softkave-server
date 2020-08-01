import BaseContext from "../../contexts/BaseContext";
import RequestData from "../../contexts/RequestData";
import changePassword from "../changePassword/changePassword";
import { IChangePasswordParameters } from "../changePassword/types";
import { IChangePasswordWithTokenContext } from "./types";

export default class ChangePasswordWithTokenContext extends BaseContext
  implements IChangePasswordWithTokenContext {
  public async changePassword(
    context: BaseContext,
    instData: RequestData<IChangePasswordParameters>
  ) {
    return changePassword(context, instData);
  }
}

let cxt: IChangePasswordWithTokenContext = null;

export function getChangePasswordWithTokenContext() {
  if (cxt) {
    return cxt;
  }

  cxt = new ChangePasswordWithTokenContext();

  return cxt;
}
