import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { CollaborationRequestResponse } from "endpoints/notification/constants";
import { INotification } from "mongo/notification";

export interface IRespondToCollaborationRequestParameters {
  requestID: string;
  response: CollaborationRequestResponse;
}

export interface IRespondToCollaborationRequestContext
  extends IBaseEndpointContext {
  data: IRespondToCollaborationRequestParameters;
  addResponseToCollaborationRequestInDatabase: (
    customId: string,
    email: string,
    response: string
  ) => Promise<INotification>;
  deleteCollaborationRequestInDatabase: (id: string) => Promise<void>;
  addOrgToUser: (orgID: string, userID: string) => Promise<void>;
}
