import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicRoomData } from "../types";

export interface IGetRoomsEndpointParams {
  orgId: string;
}

export interface IGetRoomsEndpointResult {
  rooms: IPublicRoomData[];
}

export type GetRoomsEndpoint = Endpoint<
  IBaseContext,
  IGetRoomsEndpointParams,
  IGetRoomsEndpointResult
>;
