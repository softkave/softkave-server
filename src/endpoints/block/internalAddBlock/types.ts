import { IBlock } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { INewBlockInput } from "../types";

export interface IInternalAddBlockParameters {
    block: INewBlockInput;
}

export interface IInternalAddBlockResult {
    block: IBlock;
}

export type InternalAddBlockEndpoint = Endpoint<
    IBaseContext,
    IInternalAddBlockParameters,
    IInternalAddBlockResult
>;
