import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import {
  IAddBlockToDatabaseContext,
  IAddBlockToDatabaseParameters
} from "./types";

export interface IAddBlockToDatabaseContextParameters
  extends IBaseEndpointContextParameters {
  data: IAddBlockToDatabaseParameters;
}

export default class AddBlockToDatabaseContext extends BaseEndpointContext
  implements IAddBlockToDatabaseContext {
  public data: IAddBlockToDatabaseParameters;

  constructor(p: IAddBlockToDatabaseContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async saveBlock() {}
}
