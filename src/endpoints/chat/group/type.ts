import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetGroupMessageParameters {
  customId: string;
  orgId: string;
}

export type getGroupMessageEndpoint = Endpoint<IBaseContext, IGetGroupMessageParameters>