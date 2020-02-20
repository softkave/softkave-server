import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import TransferBlockContext from "../transferBlock/context";
import transferBlock from "../transferBlock/transferBlock";
import {
  IDirectUpdateBlockInput,
  IUpdateBlockContext,
  IUpdateBlockParameters
} from "./types";

export interface IUpdateBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: IUpdateBlockParameters;
}

export default class UpdateBlockContext extends BaseEndpointContext
  implements IUpdateBlockContext {
  public data: IUpdateBlockParameters;

  constructor(p: IUpdateBlockContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async updateBlock(blockID: string, data: IDirectUpdateBlockInput) {
    try {
      await this.blockModel.model.updateOne(
        {
          customId: blockID
        },
        data
      );
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async transferBlock(
    block: IBlock,
    sourceBlockID: string,
    destinationBlockID: string
  ) {
    await transferBlock(
      new TransferBlockContext({
        blockModel: this.blockModel,
        notificationModel: this.notificationModel,
        userModel: this.userModel,
        req: this.req,
        data: {
          sourceBlock: sourceBlockID,
          draggedBlock: block.customId,
          destinationBlock: destinationBlockID
        }
      })
    );
  }
}
