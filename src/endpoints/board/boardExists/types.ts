import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IBoardExistsParameters {
    name: string;
    parent: string;
}

export type BoardExistsEndpoint = Endpoint<
    IBaseContext,
    IBoardExistsParameters,
    { exists: boolean }
>;
