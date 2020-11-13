import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { InternalAddBlockEndpoint } from "../internalAddBlock/types";
import { INewBlockInput, IPublicBlock } from "../types";

export interface IAddBlockParameters {
    block: INewBlockInput;
}

export interface IAddBlockContext extends IBaseContext {
    addBlock: InternalAddBlockEndpoint;
}

export interface IAddBlockResult {
    block: IPublicBlock;
}

export type AddBlockEndpoint = Endpoint<
    IAddBlockContext,
    IAddBlockParameters,
    IAddBlockResult
>;
