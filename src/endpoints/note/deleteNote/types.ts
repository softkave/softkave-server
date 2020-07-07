import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeleteNoteParameters {
  noteId: string;
}

export type DeleteNoteEndpoint = Endpoint<IBaseContext, IDeleteNoteParameters>;
