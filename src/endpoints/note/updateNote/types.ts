import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IUpdateNoteInput } from "../types";

export interface IUpdateNoteParameters {
  noteId: string;
  data: IUpdateNoteInput;
}

export type UpdateNoteEndpoint = Endpoint<IBaseContext, IUpdateNoteParameters>;
