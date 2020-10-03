import { IChat } from "../../../mongo/chat";
import { IRoom } from "../../../mongo/room";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetUserRoomsAndChatsParameters {
    orgId: string;
}

export interface IGetUserRoomsAndChatsEndpointResult {
    rooms: IRoom[];
    chats: IChat[];
}

export type GetUserRoomsAndChatsEndpoint = Endpoint<
    IBaseContext,
    IGetUserRoomsAndChatsParameters,
    IGetUserRoomsAndChatsEndpointResult
>;
