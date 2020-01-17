import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import { ILoginContext, ILoginParameters } from "./types";

export interface ILoginContextParameters
  extends IBaseEndpointContextParameters {
  data: ILoginParameters;
}

export default class LoginContext extends BaseEndpointContext
  implements ILoginContext {
  public data: ILoginParameters;

  constructor(p: ILoginContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async getUserByEmail(email: string) {
    try {
      return await this.userModel.model
        .findOne({
          email
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
