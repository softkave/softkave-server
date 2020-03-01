import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
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
      return await this.blockModel.model
        .findOne({
          lowerCasedName: name.toLowerCase()
        })
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
