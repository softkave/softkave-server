import { IBlock } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetUserRootBlocksResult {
  blocks: IBlock[];
}

export type GetUserRootBlocksEndpoint = Endpoint<
  IBaseContext,
  undefined,
  IGetUserRootBlocksResult
>;
