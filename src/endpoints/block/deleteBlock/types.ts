import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IDeleteBlockParameters {
  blockID: string;
}

export interface IDeleteBlockContext extends IBaseEndpointContext {
  data: IDeleteBlockParameters;
  deleteBlockInDatabase: (blockID: string) => Promise<void>;
}
