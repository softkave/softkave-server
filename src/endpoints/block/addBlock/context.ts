import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import addBlockToDatabase from "../addBlockToDatabase/addBlockToDatabase";
import AddBlockToDatabaseContext from "../addBlockToDatabase/context";
import { INewBlockInput } from "../types";
import { IAddBlockContext, IAddBlockParameters } from "./types";

export interface IAddBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: IAddBlockParameters;
}

export default class AddBlockContext extends BaseEndpointContext
  implements IAddBlockContext {
  public data: IAddBlockParameters;

  constructor(p: IAddBlockContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async addBlockToStorage(newBlock: INewBlockInput) {
    const result = await addBlockToDatabase(
      new AddBlockToDatabaseContext({
        req: this.req,
        blockModel: this.blockModel,
        notificationModel: this.notificationModel,
        userModel: this.userModel,
        data: { block: newBlock }
      })
    );

    return result.block;
  }
}
