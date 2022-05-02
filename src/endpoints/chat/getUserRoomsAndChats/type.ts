import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicChatData, IPublicRoomData } from "../types";

export interface IGetUserRoomsAndChatsEndpointResult {
  rooms: IPublicRoomData[];
  chats: IPublicChatData[];
}

export type GetUserRoomsAndChatsEndpoint = Endpoint<
  IBaseContext,
  {},
  IGetUserRoomsAndChatsEndpointResult
>;
