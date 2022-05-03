import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicRoomData } from "../types";

export interface IAddRoomEndpointParameters {
  recipientId: string;
  orgId: string;
}

export interface IAddRoomEndpointResult {
  room: IPublicRoomData;
}

export type AddRoomEndpoint = Endpoint<
  IBaseContext,
  IAddRoomEndpointParameters,
  IAddRoomEndpointResult
>;
