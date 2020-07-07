import { INote } from "../../../mongo/note";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { NoteExistsEndpoint } from "../noteExists/types";
import { INewNoteInput } from "../types";

export interface IAddNoteParameters {
  note: INewNoteInput;
}

export interface IAddNoteResult {
  note: INote;
}

export interface IAddNoteContext extends IBaseContext {
  noteExists: NoteExistsEndpoint;
}

export type AddNoteEndpoint = Endpoint<
  IAddNoteContext,
  IAddNoteParameters,
  IAddNoteResult
>;
