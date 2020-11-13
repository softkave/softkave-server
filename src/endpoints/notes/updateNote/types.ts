import { INote } from "../../../mongo/note";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IUpdateNoteInput } from "../types";

export interface IUpdateNoteParameters {
    noteId: string;
    data: IUpdateNoteInput;
}

export interface IUpdateNoteResult {
    note: INote;
}

export type UpdateNoteEndpoint = Endpoint<
    IBaseContext,
    IUpdateNoteParameters,
    IUpdateNoteResult
>;
