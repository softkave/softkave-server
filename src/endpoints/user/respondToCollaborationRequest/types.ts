import {
  CollaborationRequestResponse,
  INotification
} from "../../../mongo/notification";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

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
