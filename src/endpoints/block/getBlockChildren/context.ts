import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { BlockType } from "mongo/block";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import { IGetBlockChildrenContext, IGetBlockChildrenParameters } from "./types";

export interface IGetBlockChildrenContextParameters
  extends IBaseEndpointContextParameters {
  data: IGetBlockChildrenParameters;
}

export default class GetBlockChildrenContext extends BaseEndpointContext
  implements IGetBlockChildrenContext {
  public data: IGetBlockChildrenParameters;

  constructor(p: IGetBlockChildrenContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async getBlockChildrenFromDatabase(
    blockID: string,
    typeList: BlockType[]
  ) {
    try {
      const blocks = await this.blockModel.model.find({
        parents: {
          $size: getParentsLength(parentBlock) + 1,
          $eq: parentBlock.customId
        },
        type: {
          $in: types
        }
      });
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
