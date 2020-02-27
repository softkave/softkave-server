import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import sendCollabReqEmail from "../sendCollabRequestEmail";
import { IAddCollaboratorsContext, IAddCollaboratorsParameters } from "./types";

export interface IAddCollaboratorsContextParameters
  extends IBaseEndpointContextParameters {
  data: IAddCollaboratorsParameters;
}

export default class AddCollaboratorsContext extends BaseEndpointContext
  implements IAddCollaboratorsContext {
  public data: IAddCollaboratorsParameters;

  constructor(p: IAddCollaboratorsContextParameters) {
    super(p);
    this.data = p.data;
  }
  public async getExistingCollaborationRequests(userEmails, blockID) {
    try {
      return await this.notificationModel.model
        .find({
          "to.email": {
            $in: userEmails
          },
          "from.blockId": blockID
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async saveNotifications(notifications) {
    try {
      await this.notificationModel.model.insertMany(notifications);
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async sendCollaborationRequestEmail(p) {
    return sendCollabReqEmail(p);
  }

  public async getUserListByEmail(userEmails) {
    try {
      return await this.userModel.model
        .find({ email: { $in: userEmails } }, "email orgs")
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
