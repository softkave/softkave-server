import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import {
  IRespondToCollaborationRequestParameters,
  IRespondToCollaborationRequestContext
} from "./types";

export interface IRespondToCollaborationRequestContextParameters
  extends IBaseEndpointContextParameters {
  data: IRespondToCollaborationRequestParameters;
}

export default class RespondToCollaborationRequestContext
  extends BaseEndpointContext
  implements IRespondToCollaborationRequestContext {
  public data: IRespondToCollaborationRequestParameters;

  constructor(p: IRespondToCollaborationRequestContextParameters) {
    super(p);
    this.data = p.data;
  }
}
