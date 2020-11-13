import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface INoteExistsParameters {
    name: string;
    blockId: string;
}

export type NoteExistsEndpoint = Endpoint<
    IBaseContext,
    INoteExistsParameters,
    { exists: boolean }
>;
