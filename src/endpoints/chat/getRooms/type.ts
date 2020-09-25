import { IRoom } from "../../../mongo/room";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetRoomsParameters {
    orgId: string;
}

export type GetRoomsEndpoint = Endpoint<
    IBaseContext,
    IGetRoomsParameters,
    IRoom[]
>;
