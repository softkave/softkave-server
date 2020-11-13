import { IUser } from "../../../mongo/user";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { InternalAddBlockEndpoint } from "../internalAddBlock/types";
import { IPublicBlock } from "../types";

export interface ICreateRootBlockParameters {
    user: IUser;
}

export interface ICreateRootBlockResult {
    block: IPublicBlock;
}

export interface ICreateRootBlockContext extends IBaseContext {
    addBlock: InternalAddBlockEndpoint;
}

export type CreateRootBlockEndpoint = Endpoint<
    ICreateRootBlockContext,
    ICreateRootBlockParameters,
    ICreateRootBlockResult
>;
