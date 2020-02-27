import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
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
