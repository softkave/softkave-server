import { INotification } from "../../../mongo/notification";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IRemoveCollaboratorParameters {
  customId: string;
  collaborator: string;
}

export interface IRemoveCollaboratorContext extends IBaseEndpointContext {
  data: IRemoveCollaboratorParameters;
  sendNotification: (notification: INotification) => Promise<void>;
}
