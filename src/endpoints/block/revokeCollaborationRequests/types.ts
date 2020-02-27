import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IRevokeCollaborationRequestsParameters {
  request: string;
  customId: string;
}

export interface IRevokeCollaborationRequestsContext
  extends IBaseEndpointContext {
  data: IRevokeCollaborationRequestsParameters;
}
