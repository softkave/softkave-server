import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import {
  IGetBlocksWithCustomIDsContext,
  IGetBlocksWithCustomIDsParameters
} from "./types";

export interface IGetBlocksWithCustomIDsContextParameters
  extends IBaseEndpointContextParameters {
  data: IGetBlocksWithCustomIDsParameters;
}

export default class GetBlocksWithCustomIDsContext extends BaseEndpointContext
  implements IGetBlocksWithCustomIDsContext {
  public data: IGetBlocksWithCustomIDsParameters;

  constructor(p: IGetBlocksWithCustomIDsContextParameters) {
    super(p);
    this.data = p.data;
  }
}
