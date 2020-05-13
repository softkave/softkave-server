import { BlockType } from "../../../mongo/block";
import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters,
} from "../../BaseEndpointContext";
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
    typeList: BlockType[],
    useBoardId?: boolean
  ) {
    try {
      const query: any = {
        type: {
          $in: typeList,
        },
      };

      if (useBoardId) {
        query.boardId = blockID;
      } else {
        query.parent = blockID;
      }

      const blocks = await this.blockModel.model.find(query).exec();

      return blocks;
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
