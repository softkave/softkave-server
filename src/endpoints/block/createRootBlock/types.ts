import { IUser } from "../../../mongo/user";
import { Endpoint } from "../../types";
import {
    IInternalAddBlockContext,
    InternalAddBlockEndpoint,
} from "../internalAddBlock/types";
import { IPublicBlock } from "../types";

export interface ICreateRootBlockParameters {
    user: IUser;
}

export interface ICreateRootBlockResult {
    block: IPublicBlock;
}

export interface ICreateRootBlockContext extends IInternalAddBlockContext {
    addBlock: InternalAddBlockEndpoint;
}

export type CreateRootBlockEndpoint = Endpoint<
    ICreateRootBlockContext,
    ICreateRootBlockParameters,
    ICreateRootBlockResult
>;
