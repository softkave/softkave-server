import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { INotification } from "mongo/notification";

export interface IGetBlockCollaborationRequestsParameters {
  customId: string;
}

export interface IGetBlockCollaborationRequestsContext
  extends IBaseEndpointContext {
  data: IGetBlockCollaborationRequestsParameters;
  getCollaborationRequestsFromStorage: (
    blockID: string
  ) => Promise<INotification[]>;
}

export interface IGetBlockCollaborationRequestsResult {
  requests: INotification[];
}
