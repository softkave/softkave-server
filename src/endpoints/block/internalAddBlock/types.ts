import { IBlock } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { BlockExistsEndpoint } from "../blockExists/types";
import { INewBlockInput } from "../types";

export interface IInternalAddBlockParameters {
  block: INewBlockInput;
}

export interface IInternalAddBlockContext extends IBaseContext {
  blockExists: BlockExistsEndpoint;
}

export interface IInternalAddBlockResult {
  block: IBlock;
}

export type InternalAddBlockEndpoint = Endpoint<
  IInternalAddBlockContext,
  IInternalAddBlockParameters,
  IInternalAddBlockResult
>;
