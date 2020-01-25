import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import { IGetAncestorBlocksContext } from "./types";

// tslint:disable-next-line: no-empty-interface
export interface IGetAncestorBlocksContextParameters
  extends IBaseEndpointContextParameters {}

export default class GetAncestorBlocksContext extends BaseEndpointContext
  implements IGetAncestorBlocksContext {
  constructor(p: IGetAncestorBlocksContextParameters) {
    super(p);
  }

  public async getAncestorBlocksFromDatabase() {
    try {
      const user = await this.getUser();
      const organizationIDs = Array.isArray(user.orgs) ? user.orgs : [];
      const query = {
        customId: {
          $in: organizationIDs
        }
      };

      return await this.blockModel.model
        .find(query)
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
