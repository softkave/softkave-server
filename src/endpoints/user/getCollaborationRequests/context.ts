import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { IGetCollaborationRequestsContext } from "./types";

// tslint:disable-next-line: no-empty-interface
export interface IGetCollaborationRequestsContextParameters
  extends IBaseEndpointContextParameters {}

export default class GetCollaborationRequestsContext extends BaseEndpointContext
  implements IGetCollaborationRequestsContext {
  constructor(p: IGetCollaborationRequestsContextParameters) {
    super(p);
  }

  public async getCollaborationRequestsFromStorage(userEmail: string) {
    try {
      const requests = await this.notificationModel.model
        .find({
          "to.email": userEmail
        })
        .lean()
        .exec();

      return requests;
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
