import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IDeleteBlockParameters {
  customId: string;
}

export interface IDeleteBlockContext extends IBaseEndpointContext {
  data: IDeleteBlockParameters;
  deleteBlockInStorage: (customId: string) => Promise<void>;
  deleteBlockChildrenInStorage: (customId: string) => Promise<void>;
}
