import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { INotification } from "mongo/notification";

export interface IGetCollaborationRequestsContext extends IBaseEndpointContext {
  getCollaborationRequestsFromStorage: (
    userEmail: string
  ) => Promise<INotification[]>;
}

export interface IGetCollaborationRequestsResult {
  requests: INotification[];
}
