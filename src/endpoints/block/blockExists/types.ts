import { BlockType } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IBlockExistsParameters {
    name: string;
    type: BlockType;
    parent?: string;
    rootBlockId?: string;
}

export type BlockExistsEndpoint = Endpoint<
    IBaseContext,
    IBlockExistsParameters,
    { exists: boolean }
>;
