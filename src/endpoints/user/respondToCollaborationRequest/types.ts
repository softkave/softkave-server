import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import {
  CollaborationRequestResponse,
  INotification
} from "mongo/notification";

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
