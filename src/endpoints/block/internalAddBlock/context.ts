import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import { IEndpointInstanceData } from "../../contexts/types";
import blockExists from "../blockExists/blockExists";
import { IBlockExistsParameters } from "../blockExists/types";
import { IInternalAddBlockContext } from "./types";

export default class InternalAddBlockContext extends BaseContext
  implements IInternalAddBlockContext {
  public async blockExists(
    context: IBaseContext,
    instData: IEndpointInstanceData<IBlockExistsParameters>
  ) {
    return blockExists(context, instData);
  }
}
