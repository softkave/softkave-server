import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import addBlockToDatabase from "../addBlockToDatabase/addBlockToDatabase";
import AddBlockToDatabaseContext from "../addBlockToDatabase/context";
import { INewBlockInput } from "../types";
import { ICreateRootBlockContext } from "./types";

// tslint:disable-next-line: no-empty-interface
export interface ICreateRootBlockContextParameters
  extends IBaseEndpointContextParameters {}

export default class CreateRootBlockContext extends BaseEndpointContext
  implements ICreateRootBlockContext {
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
