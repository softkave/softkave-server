import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IUpdateRoomReadCounterParameters {
    organizationId: string;
    roomId: string;
    readCounter?: number;
}

export interface IUpdateRoomReadCounterResult {
    readCounter: string;
}

export type UpdateRoomReadCounterEndpoint = Endpoint<
    IBaseContext,
    IUpdateRoomReadCounterParameters,
    IUpdateRoomReadCounterResult
>;
