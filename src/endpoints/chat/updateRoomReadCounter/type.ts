import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IUpdateRoomReadCounterParameters {
    orgId: string;
    roomId: string;
    readCounter: string;
}

export type UpdateRoomReadCounterEndpoint = Endpoint<
    IBaseContext,
    IUpdateRoomReadCounterParameters
>;
