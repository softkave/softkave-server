import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IGetRoomsUnseenChatsCountEndpointParams {
  orgId: string;
  roomIds: string[];
}

export interface IGetRoomsUnseenChatsCountEndpointResult {
  counts: Array<{
    roomId: string;
    count: number;
  }>;
}

export type GetRoomsUnseenChatsCountEndpoint = Endpoint<
  IBaseContext,
  IGetRoomsUnseenChatsCountEndpointParams,
  IGetRoomsUnseenChatsCountEndpointResult
>;
