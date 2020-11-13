import { BlockType, IBlock } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetBlockChildrenParameters {
    blockId: string;
    typeList?: BlockType[];
}

export interface IGetBlockChildrenResult {
    blocks: IBlock[];
}

export type GetBlockChildrenEndpoint = Endpoint<
    IBaseContext,
    IGetBlockChildrenParameters,
    IGetBlockChildrenResult
>;
