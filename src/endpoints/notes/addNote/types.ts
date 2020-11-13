import { INote } from "../../../mongo/note";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { INewNoteInput } from "../types";

export interface IAddNoteParameters {
    note: INewNoteInput;
}

export interface IAddNoteResult {
    note: INote;
}

export type AddNoteEndpoint = Endpoint<
    IBaseContext,
    IAddNoteParameters,
    IAddNoteResult
>;
