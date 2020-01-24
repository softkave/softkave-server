import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
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
    await blockModel.model.updateOne(
      {
        customId: block.customId
      },
      update
    );
  }
}
