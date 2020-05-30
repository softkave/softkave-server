import { Endpoint } from "../../types";
import { IBaseContext } from "../../contexts/BaseContext";

export interface IRevokeCollaborationRequestParameters {
  requestId: string;
  blockId: string;
}

export type RevokeCollaborationRequestsEndpoint = Endpoint<
  IBaseContext,
  IRevokeCollaborationRequestParameters
>;
