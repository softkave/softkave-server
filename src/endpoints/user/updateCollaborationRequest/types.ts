import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface ICollaborationRequestUpdate {
  readAt: number;
}

export interface IUpdateCollaborationRequestParameters {
  customId: string;
  data: ICollaborationRequestUpdate;
}

export interface IUpdateCollaborationRequestContext
  extends IBaseEndpointContext {
  data: IUpdateCollaborationRequestParameters;
  updateNotificationInStorage: (
    customId: string,
    email: string,
    data: ICollaborationRequestUpdate
  ) => Promise<void>;
}
