import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetPrivateMessageParameters {
  customId: string;
  recipientId: string;
  orgId: string;
}

export type getPrivateMessageEndpoint = Endpoint<IBaseContext, IGetPrivateMessageParameters>