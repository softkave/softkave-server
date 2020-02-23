import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { INotification } from "mongo/notification";

export interface IRemoveCollaboratorParameters {
  customId: string;
  collaborator: string;
}

export interface IRemoveCollaboratorContext extends IBaseEndpointContext {
  data: IRemoveCollaboratorParameters;
  sendNotification: (notification: INotification) => Promise<void>;
}
