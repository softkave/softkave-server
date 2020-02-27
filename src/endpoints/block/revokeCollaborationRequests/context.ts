import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import {
  IRevokeCollaborationRequestsContext,
  IRevokeCollaborationRequestsParameters
} from "./types";

export interface IRevokeCollaborationRequestsContextParameters
  extends IBaseEndpointContextParameters {
  data: IRevokeCollaborationRequestsParameters;
}

export default class RevokeCollaborationRequestsContext
  extends BaseEndpointContext
  implements IRevokeCollaborationRequestsContext {
  public data: IRevokeCollaborationRequestsParameters;

  constructor(p: IRevokeCollaborationRequestsContextParameters) {
    super(p);
    this.data = p.data;
  }
}
