import { getBaseContext } from "../contexts/BaseContext";
import { wrapEndpoint } from "../utils";
import addNote from "./addNote/addNote";
import AddNoteContext from "./addNote/context";
import deleteNote from "./deleteNote/deleteNote";
import getNotes from "./getNotes/getNotes";
import noteExists from "./noteExists/noteExists";
import updateNote from "./updateNote/updateNote";

export default class NoteController {
  public addNote(data, req) {
    return wrapEndpoint(data, req, () =>
      addNote(new AddNoteContext(), { req, data })
    );
  }

  public noteExists(data, req) {
    return wrapEndpoint(data, req, () =>
      noteExists(getBaseContext(), { req, data })
    );
  }

  public deleteNote(data, req) {
    return wrapEndpoint(data, req, () =>
      deleteNote(getBaseContext(), { req, data })
    );
  }

  public updateNote(data, req) {
    return wrapEndpoint(data, req, () =>
      updateNote(getBaseContext(), { req, data })
    );
  }

  public getNotes(data, req) {
    return wrapEndpoint(data, req, () =>
      getNotes(getBaseContext(), { req, data })
    );
  }
}

const controller: NoteController = new NoteController();

export function getNoteController() {
  return controller;
}
