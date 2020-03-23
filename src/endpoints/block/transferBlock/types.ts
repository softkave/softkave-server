import { BlockGroupContext } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface ITransferBlockParameters {
  sourceBlock: string;
  draggedBlock: string;
  destinationBlock: string;
  dropPosition?: number;
  groupContext?: BlockGroupContext;
}

export interface ITransferBlockContext extends IBaseEndpointContext {
  data: ITransferBlockParameters;
}
