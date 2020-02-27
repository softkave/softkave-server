import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { ILoginContext, ILoginParameters } from "./types";

export interface ILoginContextParameters
  extends IBaseEndpointContextParameters {
  data: ILoginParameters;
}

export default class LoginContext extends BaseEndpointContext
  implements ILoginContext {
  public data: ILoginParameters;

  constructor(p: ILoginContextParameters) {
    super(p);
    this.data = p.data;
  }
}
