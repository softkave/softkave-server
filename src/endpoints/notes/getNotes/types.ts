import { INote } from "../../../mongo/note";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetNotesParameters {
    blockId: string;
}

export interface IGetNotesResult {
    notes: INote[];
}

export type GetNotesEndpoint = Endpoint<
    IBaseContext,
    IGetNotesParameters,
    IGetNotesResult
>;
