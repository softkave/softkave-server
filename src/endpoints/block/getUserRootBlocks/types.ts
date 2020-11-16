import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicBlock } from "../types";

export interface IGetUserRootBlocksResult {
    blocks: IPublicBlock[];
}

export type GetUserRootBlocksEndpoint = Endpoint<
    IBaseContext,
    undefined,
    IGetUserRootBlocksResult
>;
