import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import addBlockToDatabase from "../addBlockToDatabase/addBlockToDatabase";
import AddBlockToDatabaseContext from "../addBlockToDatabase/context";
import { INewBlockInput } from "../types";
import { ICreateRootBlockContext, ICreateRootBlockParameters } from "./types";

// tslint:disable-next-line: no-empty-interface
export interface ICreateRootBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: ICreateRootBlockParameters;
}

export default class CreateRootBlockContext extends BaseEndpointContext
  implements ICreateRootBlockContext {
  public data: ICreateRootBlockParameters;

  constructor(p: ICreateRootBlockContextParameters) {
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
