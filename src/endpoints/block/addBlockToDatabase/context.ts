import { IBlock } from "../../../mongo/block";
import mongoConstants from "../../../mongo/constants";
import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import blockExists from "../blockExists/blockExists";
import BlockExistsContext from "../blockExists/context";
import { IBlockExistsParameters } from "../blockExists/types";
import {
  IAddBlockToDatabaseContext,
  IAddBlockToDatabaseParameters
} from "./types";

export interface IAddBlockToDatabaseContextParameters
  extends IBaseEndpointContextParameters {
  data: IAddBlockToDatabaseParameters;
}

export default class AddBlockToDatabaseContext extends BaseEndpointContext
  implements IAddBlockToDatabaseContext {
  public data: IAddBlockToDatabaseParameters;

  constructor(p: IAddBlockToDatabaseContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async saveBlock(b: IBlock) {
    try {
      const block = new this.blockModel.model(b);
      await block.save();

      return block;
    } catch (error) {
      // Adding a block fails with code 11000 if unique fields like customId
      if (error.code === mongoConstants.indexNotUniqueErrorCode) {
        // TODO: Implement a way to get a new customId and retry
        throw new ServerError();
      }

      logger.error(error);
      throw new ServerError();
    }
  }

  public async doesBlockExist(p: IBlockExistsParameters) {
    return blockExists(
      new BlockExistsContext({
        req: this.req,
        blockModel: this.blockModel,
        notificationModel: this.notificationModel,
        userModel: this.userModel,
        data: p
      })
    );
  }
}
