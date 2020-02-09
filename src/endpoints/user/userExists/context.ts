import { ServerError } from "utils/errors";
import logger from "utils/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { IUserExistsContext, IUserExistsParameters } from "./types";

export interface IUserExistsContextParameters
  extends IBaseEndpointContextParameters {
  data: IUserExistsParameters;
}

export default class UserExistsContext extends BaseEndpointContext
  implements IUserExistsContext {
  public data: IUserExistsParameters;

  constructor(p: IUserExistsContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async doesUserExistInDatabase(email: string) {
    try {
      return this.userModel.model.exists({ email });
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
