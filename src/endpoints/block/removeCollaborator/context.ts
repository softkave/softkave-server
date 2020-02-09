import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { INotification } from "mongo/notification";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import {
  IRemoveCollaboratorContext,
  IRemoveCollaboratorParameters
} from "./types";

export interface IRemoveCollaboratorContextParameters
  extends IBaseEndpointContextParameters {
  data: IRemoveCollaboratorParameters;
}

export default class RemoveCollaboratorContext extends BaseEndpointContext
  implements IRemoveCollaboratorContext {
  public data: IRemoveCollaboratorParameters;

  constructor(p: IRemoveCollaboratorContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async sendNotification(notification: INotification) {
    try {
      const n = new this.notificationModel.model(notification);
      n.save();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
