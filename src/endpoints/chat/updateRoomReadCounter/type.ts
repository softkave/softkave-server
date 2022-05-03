import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicRoomData } from "../types";

export interface IUpdateRoomReadCounterParameters {
    orgId: string;
    roomId: string;
    readCounter?: number;
}

export interface IUpdateRoomReadCounterResult {
    readCounter: string;
    room: IPublicRoomData;
}

export type UpdateRoomReadCounterEndpoint = Endpoint<
    IBaseContext,
    IUpdateRoomReadCounterParameters,
    IUpdateRoomReadCounterResult
>;
