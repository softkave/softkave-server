import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";
import { INewBlockInput } from "../types";

export interface IAddCollaboratorsParameters {
  block: INewBlockInput;
}

export interface IAddCollaboratorsContext extends IBaseEndpointContext {
  data: IAddCollaboratorsParameters;
}

export interface IAddCollaboratorsResult {
  block: IBlock;
}
