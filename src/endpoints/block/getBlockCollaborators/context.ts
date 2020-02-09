import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import {
  IGetBlockCollaboratorsContext,
  IGetBlockCollaboratorsParameters
} from "./types";

export interface IAddBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: IGetBlockCollaboratorsParameters;
}

export default class AddBlockContext extends BaseEndpointContext
  implements IGetBlockCollaboratorsContext {
  public data: IGetBlockCollaboratorsParameters;

  constructor(p: IAddBlockContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async getBlockCollaborators(blockID: string) {
    try {
      return await this.userModel.model
        .find(
          {
            orgs: blockID
          },
          "name email createdAt customId"
        )
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
