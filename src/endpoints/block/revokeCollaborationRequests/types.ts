import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IRevokeCollaborationRequestsParameters {
  requestID: string;
  blockID: string;
}

export interface IRevokeCollaborationRequestsContext
  extends IBaseEndpointContext {
  data: IRevokeCollaborationRequestsParameters;
}
