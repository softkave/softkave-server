import { IBlock } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface ITransferBlockParameters {
    draggedBlockId: string;
    destinationBlockId: string;
}

export interface ITransferBlockResult {
    draggedBlock: IBlock;
}

export type TransferBlockEndpoint = Endpoint<
    IBaseContext,
    ITransferBlockParameters,
    ITransferBlockResult
>;
