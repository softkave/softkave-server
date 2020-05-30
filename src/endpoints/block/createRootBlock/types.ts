import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { Endpoint } from "../../types";
import {
  IInternalAddBlockContext,
  InternalAddBlockEndpoint,
} from "../internalAddBlock/types";

export interface ICreateRootBlockParameters {
  user: IUser;
}

export interface ICreateRootBlockResult {
  block: IBlock;
}

export interface ICreateRootBlockContext extends IInternalAddBlockContext {
  addBlock: InternalAddBlockEndpoint;
}

export type CreateRootBlockEndpoint = Endpoint<
  ICreateRootBlockContext,
  ICreateRootBlockParameters,
  ICreateRootBlockResult
>;
