import { IBlock } from "../../../mongo/block";
import { Endpoint } from "../../types";
import {
  IInternalAddBlockContext,
  InternalAddBlockEndpoint,
} from "../internalAddBlock/types";
import { INewBlockInput } from "../types";

export interface IAddBlockParameters {
  block: INewBlockInput;
}

export interface IAddBlockContext extends IInternalAddBlockContext {
  addBlock: InternalAddBlockEndpoint;
}

export interface IAddBlockResult {
  block: IBlock;
}

export type AddBlockEndpoint = Endpoint<
  IAddBlockContext,
  IAddBlockParameters,
  IAddBlockResult
>;
