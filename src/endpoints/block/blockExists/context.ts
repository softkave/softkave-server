import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import { IBlockExistsContext, IBlockExistsParameters } from "./types";

export interface IBlockExistsContextParameters
  extends IBaseEndpointContextParameters {
  data: IBlockExistsParameters;
}

export default class BlockExistsContext extends BaseEndpointContext
  implements IBlockExistsContext {
  public data: IBlockExistsParameters;

  constructor(p: IBlockExistsContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async getBlockByName(name) {
    try {
      return await this.blockModel.model.findOne({
        lowerCasedName: name.toLowerCase()
      });
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
