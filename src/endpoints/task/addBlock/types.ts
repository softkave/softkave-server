import { Endpoint } from "../../types";
import {
    IInternalAddBlockContext,
    InternalAddBlockEndpoint,
} from "../internalAddBlock/types";
import { INewTaskInput, IPublicTask } from "../types";

export interface IAddBlockParameters {
    block: INewTaskInput;
}

export interface IAddBlockContext extends IInternalAddBlockContext {
    addBlock: InternalAddBlockEndpoint;
}

export interface IAddBlockResult {
    block: IPublicTask;
}

export type AddBlockEndpoint = Endpoint<
    IAddBlockContext,
    IAddBlockParameters,
    IAddBlockResult
>;
