import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface ITransferBlockParameters {
  sourceBlock: string;
  draggedBlock: string;
  destinationBlock: string;
  dropPosition?: number;
  groupContext?: "task" | "project";
}

export interface ITransferBlockContext extends IBaseEndpointContext {
  data: ITransferBlockParameters;
}
