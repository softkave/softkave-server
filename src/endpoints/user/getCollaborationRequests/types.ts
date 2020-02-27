import { INotification } from "../../../mongo/notification";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IGetCollaborationRequestsContext extends IBaseEndpointContext {
  getCollaborationRequestsFromStorage: (
    userEmail: string
  ) => Promise<INotification[]>;
}

export interface IGetCollaborationRequestsResult {
  requests: INotification[];
}
