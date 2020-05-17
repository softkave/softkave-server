import { INotification } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";
import { ISendCollaborationRequestEmailProps } from "../sendCollabRequestEmail";

interface INewCollaboratorInput {
  email: string;
  body: string;
  expiresAt: number;
  customId: string;
}

export interface IAddCollaboratorsParameters {
  customId: string;
  collaborators: INewCollaboratorInput[];
}

export interface IAddCollaboratorsContext extends IBaseEndpointContext {
  data: IAddCollaboratorsParameters;
  getUserListByEmail: (userEmails: string[]) => Promise<IUser[]>;
  getExistingCollaborationRequests: (
    userEmails: string[],
    blockID: string
  ) => Promise<INotification[]>;
  saveNotifications: (notifications: INotification[]) => Promise<void>;
  sendCollaborationRequestEmail: (
    p: ISendCollaborationRequestEmailProps
  ) => Promise<any>;
}
