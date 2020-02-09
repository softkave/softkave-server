import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import {
  IGetBlockCollaborationRequestsContext,
  IGetBlockCollaborationRequestsParameters
} from "./types";

export interface IGetBlockCollaborationRequestsContextParameters
  extends IBaseEndpointContextParameters {
  data: IGetBlockCollaborationRequestsParameters;
}

export default class GetBlockCollaborationRequestsContext
  extends BaseEndpointContext
  implements IGetBlockCollaborationRequestsContext {
  public data: IGetBlockCollaborationRequestsParameters;

  constructor(p: IGetBlockCollaborationRequestsContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async getCollaborationRequestsFromStorage(blockID: string) {
    try {
      return await this.notificationModel.model
        .find({
          "from.blockId": blockID
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
