import { BlockType } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicBlock } from "../types";

export interface IGetBlockChildrenParameters {
    blockId: string;
    typeList?: BlockType[];
}

export interface IGetBlockChildrenResult {
    blocks: IPublicBlock[];
}

export type GetBlockChildrenEndpoint = Endpoint<
    IBaseContext,
    IGetBlockChildrenParameters,
    IGetBlockChildrenResult
>;
