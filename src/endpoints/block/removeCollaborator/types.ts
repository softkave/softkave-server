import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { INotification } from "mongo/notification";

export interface IRemoveCollaboratorParameters {
  blockID: string;
  collaboratorID: string;
}

export interface IRemoveCollaboratorContext extends IBaseEndpointContext {
  data: IRemoveCollaboratorParameters;
  sendNotification: (notification: INotification) => Promise<void>;
}
