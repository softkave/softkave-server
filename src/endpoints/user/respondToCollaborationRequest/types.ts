import { IBlock } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export type CollaborationRequestResponse = "accepted" | "declined";

export interface IRespondToCollaborationRequestParameters {
  requestId: string;
  response: CollaborationRequestResponse;
}
export interface IRespondToCollaborationRequestResult {
  block: IBlock;
}

export type RespondToCollaborationRequestEndpoint = Endpoint<
  IBaseContext,
  IRespondToCollaborationRequestParameters,
  IRespondToCollaborationRequestResult
>;
