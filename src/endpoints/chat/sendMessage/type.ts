import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicChatData } from "../types";

export interface ISendMessageParameters {
  orgId: string;
  message: string;
  roomId: string;
}

export interface ISendMessageEndpointResult {
  chat: IPublicChatData;
}

export type SendMessageEndpoint = Endpoint<
  IBaseContext,
  ISendMessageParameters,
  ISendMessageEndpointResult
>;
