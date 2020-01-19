import BlockModel from "mongo/block/BlockModel";
import { IUser } from "mongo/user";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { INewUser, INewUserInput, ISignupContext } from "./types";

export interface ISignupContextParameters
  extends IBaseEndpointContextParameters {
  data: INewUserInput;
  blockModel: BlockModel;
}

export default class SignupContext extends BaseEndpointContext
  implements ISignupContext {
  protected blockModel: BlockModel;

  constructor(p: ISignupContextParameters) {
    super(p);
    this.blockModel = p.blockModel;
  }

  public async createUserRootBlock(user: IUser) {}

  public async saveUser(user: INewUser) {}

  public async userExists(email: string) {}
}
