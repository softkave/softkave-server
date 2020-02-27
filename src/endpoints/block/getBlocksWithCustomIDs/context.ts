import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
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
