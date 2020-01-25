import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IRevokeCollaborationRequestsParameters {
  requestID: string;
}

export interface IRevokeCollaborationRequestsContext
  extends IBaseEndpointContext {
  data: IRevokeCollaborationRequestsParameters;
  revokeCollaborationRequestsInDatabase: (requestID: string) => Promise<void>;
}
