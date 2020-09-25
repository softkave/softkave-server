import { BlockType, IBlock } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IBlockExistsParameters {
  name: string;
  type: BlockType;
  parent?: string;
}

export type BlockExistsEndpoint = Endpoint<
  IBaseContext,
  IBlockExistsParameters,
  boolean
>;
