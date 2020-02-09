import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import { blockConstants } from "../constants";
import { IGetAssignedTasksContext } from "./types";

// tslint:disable-next-line: no-empty-interface
export interface IGetAssignedTasksContextParameters
  extends IBaseEndpointContextParameters {}

export default class GetAssignedTasksContext extends BaseEndpointContext
  implements IGetAssignedTasksContext {
  constructor(p: IGetAssignedTasksContextParameters) {
    super(p);
  }

  public async getAssignedTasksFromStorage() {
    try {
      const user = await this.getUser();

      return await this.blockModel.model
        .find({
          ["taskCollaborators.userId"]: user.customId,
          type: blockConstants.blockTypes.task
        })
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
