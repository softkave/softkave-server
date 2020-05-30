import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ITransferBlockParameters {
  draggedBlockId: string;
  destinationBlockId: string;
}

export type TransferBlockEndpoint = Endpoint<
  IBaseContext,
  ITransferBlockParameters
>;
