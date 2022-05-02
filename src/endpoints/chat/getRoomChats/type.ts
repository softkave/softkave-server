import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicChatData, IPublicRoomData } from "../types";

export interface IGetRoomChatsEndpointParams {
  roomId: string;
}

export interface IGetRoomChatsEndpointResult {
  chats: IPublicChatData[];
}

export type GetRoomChatsEndpoint = Endpoint<
  IBaseContext,
  IGetRoomChatsEndpointParams,
  IGetRoomChatsEndpointResult
>;
