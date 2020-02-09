import CreateRootBlockContext from "endpoints/block/createRootBlock/context";
import createRootBlock from "endpoints/block/createRootBlock/createRootBlock";
import mongoConstants from "mongo/constants";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import UserExistsContext from "../userExists/context";
import userExists from "../userExists/userExists";
import { INewUser, INewUserInput, ISignupContext } from "./types";

export interface ISignupContextParameters
  extends IBaseEndpointContextParameters {
  data: INewUserInput;
}

export default class SignupContext extends BaseEndpointContext
  implements ISignupContext {
  public data: INewUserInput;

  constructor(p: ISignupContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async createUserRootBlock() {
    const result = await createRootBlock(
      new CreateRootBlockContext({
        req: this.req,
        notificationModel: this.notificationModel,
        blockModel: this.blockModel,
        userModel: this.userModel
      })
    );

    return result.block;
  }

  public async saveUser(user: INewUser) {
    try {
      const userDoc = new this.userModel.model(user);
      await userDoc.save();
      return userDoc;
    } catch (error) {
      // Adding a user fails with code 11000 if unique fields in this case email or customId exists
      if (error.code === mongoConstants.indexNotUniqueErrorCode) {
        // TODO: Implement a way to get a new customId and retry
        throw new ServerError();
      }

      logger.error(error);
      throw new ServerError();
    }
  }

  public async userExists(email: string) {
    return userExists(
      new UserExistsContext({
        req: this.req,
        blockModel: this.blockModel,
        notificationModel: this.notificationModel,
        userModel: this.userModel,
        data: { email }
      })
    );
  }
}
