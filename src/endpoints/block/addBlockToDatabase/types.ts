import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import {
  IBlock,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator
} from "mongo/block";
import { INewBlockInput } from "../types";

export interface IAddBlockToDatabaseParameters {
  block: INewBlockInput;
}

export interface IAddBlockToDatabaseContext extends IBaseEndpointContext {
  data: IAddBlockToDatabaseParameters;
  saveBlock: (block: IBlock) => Promise<void>;
  doesBlockExist: (block: IBlock) => Promise<boolean>;
}

export interface IAddBlockToDatabaseResult {
  block: IBlock;
}
