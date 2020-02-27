import { INotification } from "../../../mongo/notification";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

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
