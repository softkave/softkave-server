import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import {
  IGetBlockCollaboratorsContext,
  IGetBlockCollaboratorsParameters
} from "./types";

export interface IGetBlockCollaboratorsContextParameters
  extends IBaseEndpointContextParameters {
  data: IGetBlockCollaboratorsParameters;
}

export default class GetBlockCollaboratorsContext extends BaseEndpointContext
  implements IGetBlockCollaboratorsContext {
  public data: IGetBlockCollaboratorsParameters;

  constructor(p: IGetBlockCollaboratorsContextParameters) {
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
