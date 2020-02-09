import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import { IDeleteBlockContext, IDeleteBlockParameters } from "./types";

export interface IDeleteBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: IDeleteBlockParameters;
}

export default class DeleteBlockContext extends BaseEndpointContext
  implements IDeleteBlockContext {
  public data: IDeleteBlockParameters;

  constructor(p: IDeleteBlockContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async deleteBlockInStorage(customId: string) {
    try {
      await this.blockModel.model.deleteOne({ customId }).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async deleteBlockChildrenInStorage(customId: string) {
    try {
      // TODO: revise all DB block access for modified fields as part of the rewrite
      await this.blockModel.model.deleteMany({ parents: customId }).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
