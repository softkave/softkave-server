import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { IGetRootBlocksContext } from "./types";

// tslint:disable-next-line: no-empty-interface
export interface IGetRootBlocksContextParameters
  extends IBaseEndpointContextParameters {}

export default class GetRootBlocksContext extends BaseEndpointContext
  implements IGetRootBlocksContext {
  constructor(p: IGetRootBlocksContextParameters) {
    super(p);
  }

  public async getRootBlocksFromStorage() {
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
