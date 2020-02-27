import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { IUpdateUserContext, IUpdateUserParameters } from "./types";

export interface IUpdateUserContextParameters
  extends IBaseEndpointContextParameters {
  data: IUpdateUserParameters;
}

export default class UpdateUserContext extends BaseEndpointContext
  implements IUpdateUserContext {
  public data: IUpdateUserParameters;

  constructor(p: IUpdateUserContextParameters) {
    super(p);
    this.data = p.data;
  }
}
