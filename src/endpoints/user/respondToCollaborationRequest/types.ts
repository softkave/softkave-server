import { IBlock } from "../../../mongo/block";
import { INotification } from "../../../mongo/notification";
import { IBaseContext } from "../../contexts/BaseContext";
import { IBaseEndpointContext } from "../../contexts/BaseEndpointContext";
import { Endpoint } from "../../types";

export type CollaborationRequestResponse = "accepted" | "declined";

export interface IRespondToCollaborationRequestParameters {
  customId: string;
  response: CollaborationRequestResponse;
}

export interface IRespondToCollaborationRequestContext
  extends IBaseEndpointContext {
  data: IRespondToCollaborationRequestParameters;
  addResponseToCollaborationRequestToStorage: (
    customId: string,
    email: string,
    response: string
  ) => Promise<INotification>;
  deleteCollaborationRequestInStorage: (id: string) => Promise<void>;
}

export interface IRespondToCollaborationRequestResult {
  block: IBlock;
}

export type RespondToCollaborationRequestEndpoint = Endpoint<
  IBaseContext,
  IRespondToCollaborationRequestParameters,
  IRespondToCollaborationRequestResult
>;
